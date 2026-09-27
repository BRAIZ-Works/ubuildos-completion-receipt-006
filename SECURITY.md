# Security Summary
This public release is a static local browser app using synthetic demo data. It has no authentication, no privileged actions, no analytics/tracking, and no required runtime network dependency.

User-visible values are rendered with `textContent`. CSV export neutralizes formula-leading cells. The public demo warns against entering credentials, confidential information, regulated data, or customer-private data.

Release evidence includes bounded source/dependency, secret/IP, Git-history, and live-surface checks. Those checks describe the reviewed release boundary; they are not a guarantee that every conceivable security issue or future mutation is impossible.