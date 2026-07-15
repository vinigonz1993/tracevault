export interface AuditEvent {
    id: string;
    action: string;
    entityType?: string;
    entityId?: string;
    payload: Record<string, unknown>;
}