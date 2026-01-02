# Workspace Rule: Strict-API-Contract

## Logic
All agents must strictly adhere to `.antigravity/shared_context/openapi.yaml`.

## Constraints
1. **Backend Agents**:
   - Must NOT change port numbers (3001, 3002, 3003).
   - Must NOT change route signatures without user approval.
2. **Frontend Agent**:
   - Must use these exact endpoints defined in the OpenAPI spec.
