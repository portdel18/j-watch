// Notification delivery service
// Push: browser Notification API (working)
// Email: stubbed (needs backend proxy + Brevo/SendPulse)
// SMS: stubbed (needs backend proxy + Twilio)
// Slack: stubbed (needs webhook URL)

// Check if push notifications are supported and permitted
export function isPushSupported() {
  return 'Notification' in window;
}

export async function requestPushPermission() {
  if (!isPushSupported()) return 'unsupported';
  const permission = await Notification.requestPermission();
  return permission; // 'granted', 'denied', or 'default'
}

export function getPushPermission() {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

// Send push notification via browser API
export function sendPushNotification(title, options = {}) {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    console.warn('[Notifications] Push not available or not permitted');
    return false;
  }

  try {
    const notif = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: options.tag || 'jwatch-alert',
      renotify: true,
      ...options,
    });

    notif.onclick = () => {
      window.focus();
      if (options.url) {
        window.open(options.url, '_blank');
      }
      notif.close();
    };

    return true;
  } catch (err) {
    console.error('[Notifications] Push failed:', err);
    return false;
  }
}

// Send email notification (stub — needs backend)
export async function sendEmailNotification(to, subject, body) {
  const proxyUrl = process.env.REACT_APP_PROXY_URL;
  if (!proxyUrl) {
    console.warn('[Notifications] Email not configured — no proxy URL');
    return false;
  }

  try {
    const res = await fetch(`${proxyUrl}/api/notify/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Notifications] Email send failed:', err.message);
    return false;
  }
}

// Send SMS notification (stub — needs backend)
export async function sendSMSNotification(to, message) {
  console.warn('[Notifications] SMS not yet configured');
  return false;
}

// Send Slack notification (stub — needs webhook)
export async function sendSlackNotification(webhookUrl, message) {
  if (!webhookUrl) {
    console.warn('[Notifications] Slack webhook not configured');
    return false;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Notifications] Slack send failed:', err.message);
    return false;
  }
}

// Check quiet hours
function isQuietHours(settings) {
  if (!settings.quietHoursEnabled) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [fromH, fromM] = (settings.quietFrom || '22:00').split(':').map(Number);
  const [toH, toM] = (settings.quietTo || '07:00').split(':').map(Number);

  const fromMinutes = fromH * 60 + fromM;
  const toMinutes = toH * 60 + toM;

  if (fromMinutes < toMinutes) {
    return currentMinutes >= fromMinutes && currentMinutes < toMinutes;
  }
  // Spans midnight
  return currentMinutes >= fromMinutes || currentMinutes < toMinutes;
}

// Dispatch notification based on watcher settings
export async function dispatchNotification(article, watcher, settings = {}) {
  // Check quiet hours
  if (isQuietHours(settings)) {
    console.log('[Notifications] Suppressed — quiet hours active');
    return { sent: false, reason: 'quiet_hours' };
  }

  const channels = watcher.channels || { push: true };
  const results = {};

  // Push notification
  if (channels.push) {
    results.push = sendPushNotification(
      `J Watch: ${watcher.name}`,
      {
        body: article.title,
        tag: `jwatch-${watcher.id}-${article.url}`,
        url: article.url,
      }
    );
  }

  // Email notification
  if (channels.email && settings.emailAddress) {
    results.email = await sendEmailNotification(
      settings.emailAddress,
      `J Watch Alert: ${watcher.name} — ${article.title}`,
      `<h3>${article.title}</h3><p>${article.snippet}</p><p><a href="${article.url}">Read more</a></p><p>Source: ${article.source} | ${article.geoConfidence || 'unknown'} confidence</p>`
    );
  }

  // Slack notification
  if (channels.slack && settings.slackWebhook) {
    results.slack = await sendSlackNotification(
      settings.slackWebhook,
      `*J Watch: ${watcher.name}*\n${article.title}\n${article.source} | ${article.url}`
    );
  }

  return { sent: true, results };
}
