export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const { path, operation } = context;
    const message = `Firestore Permission Denied: The ${operation} operation at '${path}' was denied. Check your Firestore Security Rules.`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}
