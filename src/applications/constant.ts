export const TYPES = {
  CognitoService: 'CognitoService',
  IBorrowerService: 'IBorrowerService',
  IBorrowerRepository: 'IBorrowerRepository',
  IApplicationLogger: 'IApplicationLogger',
  IInstalmentScheduleRepository: 'IInstalmentScheduleRepository',
  IInstalmentScheduleService: 'IInstalmentScheduleService',
  ILoanRepository: 'ILoanRepository',
  ILoanService: 'ILoanService',
  IPaymentRepository: 'IPaymentRepository',
  IPaymentService: 'IPaymentService',
  IBillplzService: 'IBillplzService',
  IUserService: 'IUserService',
  IUserRepository: 'IUserRepository',
  IAuthService: 'IAuthService',
};

export const CRUD_ACTION = {
  create: 'create',
  retrieve: 'retrieve',
  update: 'update',
  delete: 'delete',
};

export const INSTALMENT_STATUS = {
  pending: 'pending',
  pendingPayment: 'pending payment',
  paid: 'paid',
  partiallyPaid: 'partially paid',
  fullyPaid: 'fully paid',
  unpaid: 'unpaid',
  upcoming: 'upcoming',
};

export const AUDIT_BY_SYSTEM = 'System';
