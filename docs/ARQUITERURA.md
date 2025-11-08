# Documento de Arquitetura - Plataforma de Gestão para Grupos de Networking

## Índice
1. [Diagrama da Arquitetura](#1-diagrama-da-arquitetura)
2. [Modelo de Dados](#2-modelo-de-dados)
3. [Estrutura de Componentes](#3-estrutura-de-componentes)
4. [Definição da API](#4-definição-da-api)

---

## 1. Diagrama da Arquitetura

![Diagrama da Arquitetura](./assets/Diagrama%20da%20Arquiterura.png)

## 2. Modelo de Dados

### Schema Prisma
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ApplicationStatus { PENDING APPROVED REJECTED }
enum MemberStatus { ACTIVE INACTIVE SUSPENDED }
enum ReferralStatus { PENDING CONTACTED NEGOTIATION CLOSED_WON CLOSED_LOST }
enum PaymentStatus { PENDING PAID OVERDUE CANCELLED }
enum MeetingType { ONE_ON_ONE GROUP GENERAL }
enum UserRole { ADMIN MODERATOR MEMBER PENDING_MEMBER }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      UserRole @default(MEMBER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  memberApplication MemberApplication?
  memberProfile     MemberProfile?
  
  @@map("users")
}

model MemberApplication {
  id          String            @id @default(cuid())
  userId      String            @unique
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName   String
  lastName    String
  email       String
  phone       String?
  company     String?
  position    String?
  motivation  String?
  status      ApplicationStatus @default(PENDING)
  submittedAt DateTime          @default(now())
  reviewedAt  DateTime?
  reviewedBy  String?
  notes       String?

  @@map("member_applications")
}

model MemberProfile {
  id          String       @id @default(cuid())
  userId      String       @unique
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName   String
  lastName    String
  avatar      String?
  phone       String
  company     String
  position    String
  industry    String
  bio         String?
  status      MemberStatus @default(ACTIVE)
  joinedAt    DateTime     @default(now())
  website     String?
  linkedin    String?
  
  referralsMade       Referral[]
  referralsReceived   Referral[]
  meetingsAttended    MeetingAttendance[]
  oneOnOneMeetings    OneOnOneMeeting[]
  payments            Payment[]
  thanksGiven         Thank[]
  thanksReceived      Thank[]

  @@map("member_profiles")
}

model Announcement {
  id          String   @id @default(cuid())
  title       String
  content     String
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  isActive    Boolean  @default(true)
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("announcements")
}

model Meeting {
  id          String      @id @default(cuid())
  title       String
  description String?
  date        DateTime
  type        MeetingType
  location    String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  attendees MeetingAttendance[]
  @@map("meetings")
}

model MeetingAttendance {
  id        String   @id @default(cuid())
  meetingId String
  meeting   Meeting  @relation(fields: [meetingId], references: [id], onDelete: Cascade)
  memberId  String
  member    MemberProfile @relation(fields: [memberId], references: [id], onDelete: Cascade)
  checkedIn Boolean  @default(false)
  checkedAt DateTime?

  @@unique([meetingId, memberId])
  @@map("meeting_attendances")
}

model Referral {
  id          String         @id @default(cuid())
  title       String
  description String
  fromMemberId String
  fromMember  MemberProfile  @relation("ReferralsMade", fields: [fromMemberId], references: [id])
  toMemberId  String
  toMember    MemberProfile  @relation("ReferralsReceived", fields: [toMemberId], references: [id])
  status      ReferralStatus @default(PENDING)
  value       Decimal?
  company     String?
  contactName String?
  contactInfo String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  closedAt    DateTime?

  @@map("referrals")
}

model Thank {
  id          String   @id @default(cuid())
  fromMemberId String
  fromMember  MemberProfile @relation("ThanksGiven", fields: [fromMemberId], references: [id])
  toMemberId  String
  toMember    MemberProfile @relation("ThanksReceived", fields: [toMemberId], references: [id])
  message     String
  referralId  String?
  referral    Referral?     @relation(fields: [referralId], references: [id])
  createdAt   DateTime @default(now())

  @@map("thanks")
}

model OneOnOneMeeting {
  id          String   @id @default(cuid())
  memberAId   String
  memberA     MemberProfile @relation("OneOnOnesAsMemberA", fields: [memberAId], references: [id])
  memberBId   String
  memberB     MemberProfile @relation("OneOnOnesAsMemberB", fields: [memberBId], references: [id])
  scheduledAt DateTime
  completedAt DateTime?
  notes       String?
  createdAt   DateTime @default(now())

  @@unique([memberAId, memberBId, scheduledAt])
  @@map("one_on_one_meetings")
}

model Payment {
  id          String        @id @default(cuid())
  memberId    String
  member      MemberProfile @relation(fields: [memberId], references: [id], onDelete: Cascade)
  amount      Decimal
  dueDate     DateTime
  paidAt      DateTime?
  status      PaymentStatus @default(PENDING)
  description String?
  externalId  String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("payments")
}
```

## 3. Estrutura de Componentes

### Arquitetura do Frontend
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   ├── (dashboard)/       # Área logada
│   ├── apply/             # Form público
│   └── api/               # API Routes
├── components/
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── features/          # Componentes por funcionalidade
│   ├── containers/        # Layouts e wrappers
│   └── shared/            # Componentes compartilhados
├── lib/                   # Utilitários e configurações
├── hooks/                 # Custom React hooks
├── stores/                # Estado global (Zustand)
└── types/                 # Tipos TypeScript
```

## 4. Definição da API

### Estrutura Base
```
GET    /api/:resource          # Listar recursos
GET    /api/:resource/:id      # Obter recurso específico  
POST   /api/:resource          # Criar recurso
PUT    /api/:resource/:id      # Atualizar recurso completo
PATCH  /api/:resource/:id      # Atualizar parcialmente
DELETE /api/:resource/:id      # Excluir recurso
```

### Endpoints Principais

**POST /api/applications** - Formulário público de intenção
```typescript
// Request
{
  "firstName": string;      // required
  "lastName": string;       // required  
  "email": string;          // required, email
  "phone": string;          // optional
  "company": string;        // optional
  "position": string;       // optional
  "motivation": string;     // optional
}

// Response (201)
{
  "id": string;
  "status": "PENDING";
  "submittedAt": string;
}
```

**GET /api/admin/applications** - Listar candidaturas (admin)
```typescript
// Query Parameters
{
  status?: "PENDING" | "APPROVED" | "REJECTED";
  page?: number;
  limit?: number;
  search?: string;
}

// Response (200)
{
  "data": Application[];
  "pagination": {
    "page": number;
    "limit": number;
    "total": number;
    "totalPages": number;
  };
}
```

**POST /api/referrals** - Criar nova indicação
```typescript
// Request
{
  "toMemberId": string;
  "title": string;
  "description": string;
  "company": string;
  "contactName": string;
  "contactInfo": string;
  "estimatedValue"?: number;
}

// Response (201)
{
  "id": string;
  "title": string;
  "status": "PENDING";
  "fromMember": { id: string; name: string; company: string };
  "toMember": { id: string; name: string; company: string };
  "createdAt": string;
}
```
