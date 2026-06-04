const http = require('http');
const PORT = process.env.PORT || 4500;

const server = http.createServer((req, res) => {

  // @endpoint POST /v1/tpay/access-token
  if (pm.mock.matchRequest('postman/collections/Sample Requests - TBC Checkout Web Payments/web-get-token.request.yaml', req)) {
    return pm.mock.sendExample('postman/collections/Sample Requests - TBC Checkout Web Payments/.resources/web-get-token.resources/examples/Get token for QR.example.yaml', res);
  }

  // @endpoint POST /v1/tpay/payments
  if (pm.mock.matchRequest('postman/collections/Sample Requests - TBC Checkout Web Payments/web-create-payment.request.yaml', req)) {
    return pm.mock.sendExample('postman/collections/Sample Requests - TBC Checkout Web Payments/.resources/web-create-payment.resources/examples/Create web payment.example.yaml', res);
  }

  // @endpoint GET /v1/tpay/payments/:payment_id
  if (pm.mock.matchRequest('postman/collections/Sample Requests - TBC Checkout Web Payments/web-get-payment.request.yaml', req)) {
    return pm.mock.sendExample('postman/collections/Sample Requests - TBC Checkout Web Payments/.resources/web-get-payment.resources/examples/Get web payment details.example.yaml', res);
  }

  // @endpoint POST /v1/tpay/payments/:payment_id/cancel
  if (pm.mock.matchRequest('postman/collections/Sample Requests - TBC Checkout Web Payments/web-cancel-payment.request.yaml', req)) {
    return pm.mock.sendExample('postman/collections/Sample Requests - TBC Checkout Web Payments/.resources/web-cancel-payment.resources/examples/Create web payment.example.yaml', res);
  }

  // @endpoint POST /v1/tpay/payments/:payment_id/completion
  if (pm.mock.matchRequest('postman/collections/Sample Requests - TBC Checkout Web Payments/web-complete-payment.request.yaml', req)) {
    // Sample response as there are no examples saved on the request.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Hi from postman mock' }));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not defined' }));
});

server.listen(PORT);
