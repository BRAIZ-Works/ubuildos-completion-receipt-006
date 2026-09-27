# Recovery / Rollback
The public release is static source. Recovery consists of restoring the exact repository/publication snapshot and redeploying it, then verifying its manifest/checksums and live surface.

User-entered browser-session data is intentionally not backed up. Reload/reset clears in-memory state, and exported CSV files remain under the user's control.

Terminal closeout requires a cold-restore verification of the exact publication snapshot. Recovery evidence is maintained in the controlled closeout record rather than inferred from the existence of a repository or ZIP alone.