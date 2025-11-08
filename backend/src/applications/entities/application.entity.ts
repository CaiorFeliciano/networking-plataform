export class Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  motivation?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: Date;
  reviewedAt?: Date;
  notes?: string;
}
