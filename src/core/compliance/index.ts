export { createComplianceService } from './service';
export type {
  AgeGroup,
  ConsentEventType,
  PrivacyRequestType,
  PrivacyRequestStatus,
  ComplianceRepository,
} from './service';

export {
  processDataRetention,
  DEFAULT_ANONYMOUS_RETENTION_DAYS,
  DEFAULT_CONSENT_RETENTION_DAYS,
} from './retention-service';
