export default function handler(req, res) {
  res.send(`User-agent: *
Allow: /*`);
}