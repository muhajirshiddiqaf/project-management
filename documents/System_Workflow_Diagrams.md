# System Workflow Diagrams

## 1. Overall System Architecture

```mermaid
graph TB
    subgraph "Frontend (React.js + SaaS UI Pro)"
        A[Dashboard] --> B[Client Management]
        A --> C[Order Management]
        A --> D[Ticket Management]
        A --> E[Invoice Management]
        A --> F[Quotation Management]
        A --> G[Team Management]
    end
    
    subgraph "Backend (Node.js + Express)"
        H[API Gateway] --> I[Authentication]
        H --> J[Client Service]
        H --> K[Order Service]
        H --> L[Ticket Service]
        H --> M[Invoice Service]
        H --> N[Quotation Service]
        H --> O[Email Service]
        H --> P[PDF Service]
    end
    
    subgraph "Database (PostgreSQL)"
        Q[Organizations] --> R[Users]
        Q --> S[Clients]
        Q --> T[Orders]
        Q --> U[Tickets]
        Q --> V[Invoices]
        Q --> W[Quotations]
        Q --> X[Services]
    end
    
    subgraph "External Services"
        Y[Stripe Payment]
        Z[SendGrid Email]
        AA[AWS S3 Storage]
        BB[Redis Cache]
    end
    
    B --> J
    C --> K
    D --> L
    E --> M
    F --> N
    J --> S
    K --> T
    L --> U
    M --> V
    N --> W
    O --> Z
    P --> AA
    M --> Y
```

## 2. Client Onboarding Workflow

```mermaid
flowchart TD
    A[Client Registration] --> B{Client Type?}
    B -->|New Client| C[Input Basic Info]
    B -->|Existing Client| D[Search Client]
    
    C --> E[Complete Client Profile]
    D --> F[Update Client Info]
    
    E --> G[Assign Client Category]
    F --> G
    
    G --> H[Add Client Contacts]
    H --> I[Record Initial Communication]
    I --> J[Schedule Follow-up]
    J --> K[Activate Client]
    
    K --> L{Create Project?}
    L -->|Yes| M[Project Setup]
    L -->|No| N[Client Ready]
    
    M --> O[Generate Quotation]
    O --> P[Send to Client]
    P --> Q[Client Review]
    Q --> R{Client Approves?}
    R -->|Yes| S[Convert to Order]
    R -->|No| T[Revise Quotation]
    T --> P
    
    S --> U[Project Execution]
    U --> V[Generate Invoice]
    V --> W[Payment Processing]
    W --> X[Project Completion]
```

## 3. Order Management Workflow

```mermaid
flowchart TD
    A[Order Creation] --> B[Select Client]
    B --> C[Choose Services]
    C --> D[Calculate Pricing]
    D --> E[Set Order Details]
    E --> F[Assign Team Member]
    F --> G[Order Status: Pending]
    
    G --> H{Order Type?}
    H -->|From Quotation| I[Auto-fill from Quotation]
    H -->|From Order Form| J[Process Form Data]
    H -->|Manual Entry| K[Manual Order Entry]
    
    I --> L[Order Review]
    J --> L
    K --> L
    
    L --> M[Order Approval]
    M --> N[Order Status: Approved]
    N --> O[Project Execution]
    O --> P[Order Status: In Progress]
    
    P --> Q[Work Completion]
    Q --> R[Order Status: Completed]
    R --> S[Generate Invoice]
    S --> T[Payment Tracking]
    T --> U[Order Closed]
```

## 4. Quotation Generation Workflow

```mermaid
flowchart TD
    A[Project Cost Calculation] --> B[Service Selection]
    B --> C[Task Breakdown]
    C --> D[Resource Assignment]
    D --> E[Material Addition]
    E --> F[Overhead Calculation]
    F --> G[Profit Margin Setting]
    G --> H[Tax & Discount]
    H --> I[Final Cost Calculation]
    
    I --> J[Generate Quotation]
    J --> K[Select PDF Template]
    K --> L[Apply Branding]
    L --> M[Generate PDF]
    M --> N[Send via Email]
    
    N --> O[Client Review]
    O --> P{Client Decision?}
    P -->|Approve| Q[Convert to Order]
    P -->|Reject| R[Revise Quotation]
    P -->|Request Changes| S[Update Quotation]
    
    R --> T[Update Pricing]
    S --> U[Modify Scope]
    T --> J
    U --> J
    
    Q --> V[Order Creation]
    V --> W[Project Execution]
```

## 5. Ticket Management Workflow

```mermaid
flowchart TD
    A[Ticket Creation] --> B[Set Priority]
    B --> C[Assign Category]
    C --> D[Add Description]
    D --> E[Ticket Status: Open]
    E --> F[Assign to Team Member]
    
    F --> G[Team Member Review]
    G --> H{Requires More Info?}
    H -->|Yes| I[Request Information]
    H -->|No| J[Start Resolution]
    
    I --> K[Client Response]
    K --> L[Update Ticket]
    L --> J
    
    J --> M[Work on Resolution]
    M --> N[Ticket Status: In Progress]
    N --> O[Resolution Complete]
    O --> P[Ticket Status: Resolved]
    
    P --> Q[Client Confirmation]
    Q --> R{Client Satisfied?}
    R -->|Yes| S[Ticket Status: Closed]
    R -->|No| T[Reopen Ticket]
    T --> M
    
    S --> U[Update Client Communication]
    U --> V[Ticket Archive]
```

## 6. Invoice & Payment Workflow

```mermaid
flowchart TD
    A[Order Completion] --> B[Generate Invoice]
    B --> C[Calculate Amount]
    C --> D[Apply Tax & Discount]
    D --> E[Set Payment Terms]
    E --> F[Invoice Status: Pending]
    
    F --> G[Send Invoice]
    G --> H[Client Receives Invoice]
    H --> I[Payment Processing]
    
    I --> J{Payment Method?}
    J -->|Online Payment| K[Stripe Processing]
    J -->|Bank Transfer| L[Manual Payment]
    J -->|Cash| M[Cash Payment]
    
    K --> N[Payment Verification]
    L --> O[Payment Confirmation]
    M --> P[Payment Recording]
    
    N --> Q[Payment Status: Paid]
    O --> Q
    P --> Q
    
    Q --> R[Update Order Status]
    R --> S[Generate Receipt]
    S --> T[Archive Invoice]
```

## 7. Email & PDF Generation Workflow

```mermaid
flowchart TD
    A[Trigger Email/PDF] --> B{Type?}
    B -->|Quotation| C[Select Quotation Template]
    B -->|Invoice| D[Select Invoice Template]
    B -->|Order Confirmation| E[Select Order Template]
    B -->|Ticket Update| F[Select Ticket Template]
    
    C --> G[Populate Data]
    D --> G
    E --> G
    F --> G
    
    G --> H[Apply Branding]
    H --> I[Generate PDF]
    I --> J[Compress PDF]
    J --> K[Store in S3]
    
    K --> L[Create Email]
    L --> M[Select Email Template]
    M --> N[Populate Variables]
    N --> O[Send via SendGrid]
    
    O --> P[Email Tracking]
    P --> Q[Delivery Status]
    Q --> R[Open Rate Tracking]
    R --> S[Click Rate Tracking]
```

## 8. Multi-Tenant Data Flow

```mermaid
flowchart TD
    A[User Login] --> B[Organization Detection]
    B --> C[Tenant Isolation]
    C --> D[Data Access Control]
    
    D --> E[Client Data]
    D --> F[Order Data]
    D --> G[Ticket Data]
    D --> H[Invoice Data]
    D --> I[Quotation Data]
    
    E --> J[Organization Scoped]
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> K[User Permissions]
    K --> L[Role-Based Access]
    L --> M[Data Filtering]
    M --> N[Secure Response]
```

## 9. Subscription & Billing Workflow

```mermaid
flowchart TD
    A[Organization Registration] --> B[Select Plan]
    B --> C[Trial Period]
    C --> D{Plan Type?}
    D -->|Starter| E[5 Users, 20 Projects]
    D -->|Professional| F[25 Users, 100 Projects]
    D -->|Enterprise| G[Unlimited Users/Projects]
    
    E --> H[Usage Tracking]
    F --> H
    G --> H
    
    H --> I[Monthly Billing]
    I --> J[Stripe Processing]
    J --> K{Payment Success?}
    K -->|Yes| L[Service Active]
    K -->|No| M[Payment Failed]
    
    M --> N[Retry Payment]
    N --> O[Payment Reminder]
    O --> P{Payment Received?}
    P -->|Yes| L
    P -->|No| Q[Service Suspended]
    
    L --> R[Usage Monitoring]
    R --> S{Usage Limits?}
    S -->|Within Limits| T[Continue Service]
    S -->|Exceeded| U[Upgrade Prompt]
    U --> V[Plan Upgrade]
    V --> L
```

## 10. Cost Calculation Workflow

```mermaid
flowchart TD
    A[Project Setup] --> B[Service Selection]
    B --> C[Complexity Assessment]
    C --> D[Task Breakdown]
    D --> E[Resource Assignment]
    E --> F[Rate Calculation]
    
    F --> G[Labor Cost]
    G --> H[Material Addition]
    H --> I[Material Cost]
    I --> J[Overhead Calculation]
    J --> K[Total Cost]
    
    K --> L[Profit Margin]
    L --> M[Tax Calculation]
    M --> N[Discount Application]
    N --> O[Final Price]
    
    O --> P[Generate Quotation]
    P --> Q[PDF Generation]
    Q --> R[Email Sending]
    R --> S[Client Review]
    
    S --> T{Client Decision?}
    T -->|Approve| U[Convert to Order]
    T -->|Reject| V[Revise Calculation]
    T -->|Request Changes| W[Update Scope]
    
    V --> X[Recalculate Cost]
    W --> Y[Modify Tasks]
    X --> O
    Y --> O
```

## 11. File Management Workflow

```mermaid
flowchart TD
    A[File Upload] --> B[File Validation]
    B --> C{File Type?}
    C -->|Image| D[Image Processing]
    C -->|Document| E[Document Processing]
    C -->|Other| F[Generic Processing]
    
    D --> G[Compress & Optimize]
    E --> H[Convert to PDF]
    F --> I[Store as-is]
    
    G --> J[AWS S3 Upload]
    H --> J
    I --> J
    
    J --> K[Generate URL]
    K --> L[Database Record]
    L --> M[File Metadata]
    M --> N[Access Control]
    
    N --> O[File Available]
    O --> P[Download Tracking]
    P --> Q[Usage Analytics]
```

## 12. Analytics & Reporting Workflow

```mermaid
flowchart TD
    A[Data Collection] --> B[Real-time Processing]
    B --> C[Data Aggregation]
    C --> D[Analytics Engine]
    
    D --> E[Revenue Analytics]
    D --> F[Client Analytics]
    D --> G[Order Analytics]
    D --> H[Ticket Analytics]
    D --> I[Team Analytics]
    
    E --> J[Dashboard Metrics]
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> K[Report Generation]
    K --> L[PDF Export]
    L --> M[Email Distribution]
    M --> N[Scheduled Reports]
    
    N --> O[Report Archive]
    O --> P[Historical Data]
    P --> Q[Trend Analysis]
    Q --> R[Predictive Analytics]
```

## 13. Security & Authentication Workflow

```mermaid
flowchart TD
    A[User Login] --> B[Credential Validation]
    B --> C{Authentication Method?}
    C -->|Email/Password| D[Password Verification]
    C -->|SSO| E[OAuth Verification]
    C -->|2FA| F[Two-Factor Auth]
    
    D --> G{Valid Credentials?}
    E --> H{SSO Valid?}
    F --> I{2FA Valid?}
    
    G -->|Yes| J[Generate JWT]
    H -->|Yes| J
    I -->|Yes| J
    
    G -->|No| K[Login Failed]
    H -->|No| K
    I -->|No| K
    
    J --> L[Role Assignment]
    L --> M[Permission Check]
    M --> N[Tenant Isolation]
    N --> O[Session Creation]
    
    O --> P[Access Granted]
    P --> Q[Activity Logging]
    Q --> R[Session Monitoring]
```

## 14. API Request Flow

```mermaid
flowchart TD
    A[Client Request] --> B[API Gateway]
    B --> C[Rate Limiting]
    C --> D[Authentication]
    D --> E[Authorization]
    E --> F[Tenant Validation]
    
    F --> G[Request Routing]
    G --> H[Service Layer]
    H --> I[Business Logic]
    I --> J[Database Query]
    
    J --> K[Data Processing]
    K --> L[Response Formatting]
    L --> M[Error Handling]
    M --> N[Response Caching]
    
    N --> O[Response Delivery]
    O --> P[Logging]
    P --> Q[Analytics]
```

## 15. Error Handling Workflow

```mermaid
flowchart TD
    A[Error Occurs] --> B[Error Detection]
    B --> C[Error Classification]
    C --> D{Error Type?}
    
    D -->|Validation Error| E[Client Notification]
    D -->|Authentication Error| F[Re-authentication]
    D -->|System Error| G[Error Logging]
    D -->|Database Error| H[Retry Logic]
    
    E --> I[User Feedback]
    F --> J[Login Redirect]
    G --> K[Error Monitoring]
    H --> L[Connection Retry]
    
    I --> M[Error Resolution]
    J --> N[Session Refresh]
    K --> O[Alert System]
    L --> P{Retry Success?}
    
    P -->|Yes| Q[Continue Operation]
    P -->|No| R[Fallback Mode]
    
    M --> S[User Experience]
    N --> T[Security Enhancement]
    O --> U[System Maintenance]
    R --> V[Graceful Degradation]
```

---

## Usage Instructions

### Untuk menggunakan diagram ini:

1. **Copy diagram code** dari section yang diinginkan
2. **Paste ke Mermaid Live Editor**: https://mermaid.live/
3. **Atau gunakan di Markdown** dengan syntax:
   ```markdown
   ```mermaid
   [diagram code]
   ```
   ``` 