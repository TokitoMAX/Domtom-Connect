async function testResend() {
  const res = await fetch('https://api.resend.com/api-keys', {
    headers: {
      'Authorization': 'Bearer re_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7'
    }
  });
  console.log('Resend status:', res.status);
  const text = await res.text();
  console.log('Resend body:', text);
}
testResend();
