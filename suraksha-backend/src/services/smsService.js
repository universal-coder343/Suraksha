const twilio = require('twilio');

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendSOSAlert = async (contacts, policeStation, sosData) => {
  if (!client) {
    console.log('Mock SMS: Twilio not configured. Would have sent:');
    console.log(`[SOS] ${sosData.userName} needs help at https://maps.google.com/?q=${sosData.lat},${sosData.lng}`);
    return;
  }

  const messageText = `🚨 SURAKSHA ALERT
${sosData.userName} needs immediate help!
Location: https://maps.google.com/?q=${sosData.lat},${sosData.lng}
Nearest Police: ${policeStation ? policeStation.name : 'Unknown'}
Live tracking: ${process.env.TRACKING_BASE_URL}/${sosData.sosId}
Time: ${new Date().toLocaleString()}`;

  const sendPromises = [];

  // Send to all contacts
  if (contacts && contacts.length > 0) {
    for (const contact of contacts) {
      if (contact.phone) {
        sendPromises.push(
          client.messages.create({
            body: messageText,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: contact.phone
          })
        );
      }
    }
  }

  // Send to police
  if (policeStation && policeStation.phone) {
    sendPromises.push(
      client.messages.create({
        body: messageText,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: policeStation.phone
      })
    );
  }

  try {
    await Promise.allSettled(sendPromises);
    console.log('SMS alerts dispatched.');
  } catch (error) {
    console.error('Error sending SMS alerts', error);
  }
};

const sendCancellation = async (contacts, userName) => {
  if (!client) return;
  const messageText = `✅ SURAKSHA UPDATE
${userName} has cancelled the SOS alert and is marked safe.`;
  
  if (contacts && contacts.length > 0) {
    for (const contact of contacts) {
      if (contact.phone) {
        client.messages.create({
          body: messageText,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phone
        }).catch(err => console.error(err));
      }
    }
  }
};

module.exports = {
  sendSOSAlert,
  sendCancellation
};
