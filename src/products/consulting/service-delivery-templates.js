/**
 * SourceKom Service Delivery Templates
 * Professional consulting service delivery framework for Saudi businesses
 * Comprehensive templates for managing client relationships and project delivery
 */

class ServiceDeliveryTemplates {
  constructor() {
    this.templates = {
      projectInitiation: null,
      clientOnboarding: null,
      progressReporting: null,
      deliverableTemplates: null,
      closureProcesses: null
    };
    
    this.saudiBusinessContext = {
      workingDays: 'Saturday - Thursday',
      workingHours: '8:00 AM - 6:00 PM',
      weekendDays: ['Friday'],
      nationalHolidays: this.getSaudiHolidays(),
      businessCulture: {
        meetingStyle: 'formal',
        communicationPreference: 'relationship-based',
        decisionMaking: 'hierarchical',
        timeOrientation: 'polychronic'
      }
    };
    
    this.serviceCategories = {
      businessSetup: 'Business Setup & Registration',
      legalCompliance: 'Legal Compliance & Saudization',
      marketEntry: 'Market Entry Strategy',
      hrConsulting: 'HR Consulting & Training',
      digitalTransformation: 'Digital Transformation',
      processOptimization: 'Process Optimization',
      financialAdvisory: 'Financial Advisory Services'
    };
  }

  // Generate project initiation template
  generateProjectInitiationTemplate(projectData) {
    const template = {
      projectName: projectData.projectName || 'New Consulting Project',
      clientId: projectData.clientId,
      projectNumber: this.generateProjectNumber(),
      initiationDate: new Date().toISOString().split('T')[0],
      
      // Project Overview
      projectOverview: {
        objective: projectData.objective || '',
        scope: projectData.scope || '',
        deliverables: projectData.deliverables || [],
        exclusions: projectData.exclusions || [],
        assumptions: projectData.assumptions || [],
        constraints: projectData.constraints || []
      },
      
      // Timeline (Saudi business context)
      timeline: {
        startDate: projectData.startDate || this.calculateSaudiBusinessDate(5),
        endDate: projectData.endDate || this.calculateSaudiBusinessDate(90),
        keyMilestones: this.generateSaudiMilestones(projectData.duration || 90),
        criticalPath: [],
        dependencies: []
      },
      
      // Team Structure
      projectTeam: {
        projectManager: projectData.projectManager || '',
        consultants: projectData.consultants || [],
        supportStaff: projectData.supportStaff || [],
        clientContacts: projectData.clientContacts || []
      },
      
      // Budget (SAR)
      financials: {
        totalBudget: projectData.budget || 0,
        currency: 'SAR',
        paymentSchedule: this.generatePaymentSchedule(projectData.budget || 0),
        expenses: projectData.expenses || [],
        contingency: (projectData.budget || 0) * 0.1
      },
      
      // Risk Management (Saudi-specific risks)
      riskManagement: {
        identifiedRisks: this.identifySaudiBusinessRisks(projectData.serviceCategory),
        mitigationStrategies: [],
        riskOwner: '',
        reviewSchedule: 'Monthly'
      },
      
      // Quality Assurance
      qualityAssurance: {
        qualityStandards: ['ISO 9001:2015', 'Saudi Quality Standards'],
        reviewProcess: ['Weekly Team Reviews', 'Client Progress Meetings', 'Monthly Quality Audits'],
        deliverableChecklist: this.generateDeliverableChecklist(projectData.serviceCategory),
        clientApprovalProcess: this.generateClientApprovalProcess()
      },
      
      // Communication Plan
      communicationPlan: {
        stakeholderMap: this.generateStakeholderMap(projectData),
        reportingFrequency: 'Bi-weekly',
        meetingSchedule: this.generateMeetingSchedule(),
        escalationMatrix: this.generateEscalationMatrix()
      },
      
      // Success Criteria
      successCriteria: {
        primaryMetrics: projectData.successMetrics || [],
        kpis: this.generateKPIs(projectData.serviceCategory),
        clientSatisfactionTarget: '90%',
        projectAcceptanceCriteria: this.generateAcceptanceCriteria(projectData.serviceCategory)
      }
    };
    
    this.templates.projectInitiation = template;
    return template;
  }

  // Generate client onboarding template
  generateClientOnboardingTemplate(clientData) {
    const template = {
      clientName: clientData.clientName,
      onboardingDate: new Date().toISOString().split('T')[0],
      accountManager: clientData.accountManager || '',
      
      // Company Information
      companyProfile: {
        industry: clientData.industry || '',
        size: clientData.companySize || '',
        location: clientData.location || '',
        website: clientData.website || '',
        yearEstablished: clientData.yearEstablished || '',
        registrationNumber: clientData.crNumber || ''
      },
      
      // Key Contacts
      keyContacts: {
        primaryContact: clientData.primaryContact || {},
        decisionMakers: clientData.decisionMakers || [],
        technicalContacts: clientData.technicalContacts || [],
        billingContact: clientData.billingContact || {}
      },
      
      // Onboarding Checklist
      onboardingChecklist: {
        documentation: [
          { task: 'Signed service agreement', completed: false, dueDate: this.calculateSaudiBusinessDate(1) },
          { task: 'Company registration documents', completed: false, dueDate: this.calculateSaudiBusinessDate(3) },
          { task: 'Tax identification (ZATCA)', completed: false, dueDate: this.calculateSaudiBusinessDate(5) },
          { task: 'Bank account details', completed: false, dueDate: this.calculateSaudiBusinessDate(7) }
        ],
        
        technicalSetup: [
          { task: 'Client portal access setup', completed: false, dueDate: this.calculateSaudiBusinessDate(2) },
          { task: 'Communication channels established', completed: false, dueDate: this.calculateSaudiBusinessDate(3) },
          { task: 'Project management tools setup', completed: false, dueDate: this.calculateSaudiBusinessDate(5) },
          { task: 'Document sharing system', completed: false, dueDate: this.calculateSaudiBusinessDate(7) }
        ],
        
        orientation: [
          { task: 'Welcome package delivery', completed: false, dueDate: this.calculateSaudiBusinessDate(1) },
          { task: 'Initial consultation meeting', completed: false, dueDate: this.calculateSaudiBusinessDate(5) },
          { task: 'Service scope walkthrough', completed: false, dueDate: this.calculateSaudiBusinessDate(7) },
          { task: 'Team introductions', completed: false, dueDate: this.calculateSaudiBusinessDate(10) }
        ]
      },
      
      // Service Agreement Summary
      serviceAgreement: {
        services: clientData.services || [],
        contractValue: clientData.contractValue || 0,
        contractDuration: clientData.contractDuration || '',
        paymentTerms: clientData.paymentTerms || 'Net 30 days',
        serviceLevelAgreement: this.generateSLA(clientData.services)
      },
      
      // Expectations Setting
      expectations: {
        responseTimes: {
          urgent: '2 hours during business hours',
          high: '8 hours during business hours',
          medium: '24 hours',
          low: '48 hours'
        },
        workingHours: this.saudiBusinessContext.workingHours,
        workingDays: this.saudiBusinessContext.workingDays,
        communicationChannels: ['Email', 'Phone', 'Client Portal', 'Scheduled Meetings'],
        reportingSchedule: 'Bi-weekly progress reports'
      },
      
      // First 90 Days Plan
      ninetyDayPlan: {
        month1: {
          focus: 'Discovery & Planning',
          activities: ['Requirements gathering', 'Process analysis', 'Stakeholder interviews', 'Project planning'],
          deliverables: ['Project charter', 'Requirements document', 'Project plan']
        },
        month2: {
          focus: 'Implementation & Development',
          activities: ['Solution development', 'Process implementation', 'Training preparation', 'Progress monitoring'],
          deliverables: ['Solution prototype', 'Training materials', 'Progress reports']
        },
        month3: {
          focus: 'Testing & Deployment',
          activities: ['Solution testing', 'User training', 'Go-live preparation', 'Performance optimization'],
          deliverables: ['Test results', 'Training completion', 'Deployment plan', 'Go-live']
        }
      }
    };
    
    this.templates.clientOnboarding = template;
    return template;
  }

  // Generate progress reporting template
  generateProgressReportTemplate(projectData, progressData) {
    const template = {
      reportMetadata: {
        projectName: projectData.projectName,
        clientName: projectData.clientName,
        reportNumber: this.generateReportNumber(),
        reportPeriod: {
          startDate: progressData.periodStart || this.calculateSaudiBusinessDate(-14),
          endDate: progressData.periodEnd || this.calculateSaudiBusinessDate(0)
        },
        reportDate: new Date().toISOString().split('T')[0],
        preparedBy: progressData.preparedBy || '',
        reviewedBy: progressData.reviewedBy || ''
      },
      
      // Executive Summary
      executiveSummary: {
        projectStatus: progressData.overallStatus || 'On Track',
        keyAchievements: progressData.achievements || [],
        challenges: progressData.challenges || [],
        nextSteps: progressData.nextSteps || [],
        clientSatisfaction: progressData.clientSatisfaction || 'Good'
      },
      
      // Project Progress
      projectProgress: {
        overallCompletion: progressData.completionPercentage || 0,
        schedulePerformance: this.calculateSchedulePerformance(progressData),
        budgetPerformance: this.calculateBudgetPerformance(progressData),
        scopeChanges: progressData.scopeChanges || [],
        qualityMetrics: this.calculateQualityMetrics(progressData)
      },
      
      // Milestone Status
      milestones: {
        completed: progressData.completedMilestones || [],
        inProgress: progressData.inProgressMilestones || [],
        upcoming: progressData.upcomingMilestones || [],
        delayed: progressData.delayedMilestones || []
      },
      
      // Financial Summary
      financialSummary: {
        totalBudget: projectData.totalBudget || 0,
        spentToDate: progressData.spentToDate || 0,
        remainingBudget: (projectData.totalBudget || 0) - (progressData.spentToDate || 0),
        burnRate: this.calculateBurnRate(progressData),
        forecastCompletion: this.calculateForecastCompletion(projectData, progressData),
        invoicing: {
          invoicedToDate: progressData.invoicedToDate || 0,
          outstanding: progressData.outstandingInvoices || 0,
          nextInvoiceDate: this.calculateNextInvoiceDate(progressData)
        }
      },
      
      // Risk & Issues
      riskAndIssues: {
        newRisks: progressData.newRisks || [],
        updatedRisks: progressData.updatedRisks || [],
        closedRisks: progressData.closedRisks || [],
        openIssues: progressData.openIssues || [],
        issueResolution: progressData.issueResolutions || []
      },
      
      // Resource Utilization
      resources: {
        teamPerformance: this.calculateTeamPerformance(progressData),
        resourceAllocation: progressData.resourceAllocation || {},
        utilizationRates: this.calculateUtilizationRates(progressData),
        trainingAndDevelopment: progressData.trainingActivities || []
      },
      
      // Client Feedback
      clientFeedback: {
        satisfactionScore: progressData.satisfactionScore || 0,
        feedbackComments: progressData.clientComments || [],
        complaints: progressData.complaints || [],
        compliments: progressData.compliments || [],
        recommendations: progressData.recommendations || []
      },
      
      // Next Period Plans
      nextPeriodPlans: {
        objectives: progressData.nextPeriodObjectives || [],
        plannedActivities: progressData.plannedActivities || [],
        resourceRequirements: progressData.resourceRequirements || [],
        budgetRequirements: progressData.budgetRequirements || 0,
        dependencies: progressData.dependencies || []
      },
      
      // Attachments
      attachments: {
        detailedReports: progressData.detailedReports || [],
        financialStatements: progressData.financialStatements || [],
        qualityReports: progressData.qualityReports || [],
        supportingDocuments: progressData.supportingDocuments || []
      }
    };
    
    this.templates.progressReporting = template;
    return template;
  }

  // Generate deliverable templates
  generateDeliverableTemplate(serviceCategory, deliverableType) {
    const templates = {
      businessSetup: {
        companyRegistration: {
          name: 'Company Registration Package',
          description: 'Complete company registration documentation and process completion',
          components: [
            'Commercial Registration (CR)',
            'MISA Investment License',
            'Chamber of Commerce Membership',
            'Municipal License',
            'Tax Registration (ZATCA)',
            'GOSI Registration',
            'Establishment Card'
          ],
          deliveryFormat: ['PDF Documentation', 'Digital Copies', 'Original Documents'],
          qualityChecklist: this.generateBusinessSetupChecklist(),
          timeline: '4-6 weeks',
          dependencies: ['Document Preparation', 'Government Submissions', 'Follow-up Activities']
        },
        
        businessPlan: {
          name: 'Comprehensive Business Plan',
          description: 'Professional business plan tailored for Saudi market and investors',
          components: [
            'Executive Summary',
            'Company Description',
            'Market Analysis (Saudi Focus)',
            'Organization Structure',
            'Service/Product Offering',
            'Marketing Strategy',
            'Financial Projections (3-5 years)',
            'Risk Assessment',
            'Implementation Timeline'
          ],
          deliveryFormat: ['PDF Document', 'Presentation Deck', 'Excel Financial Model'],
          qualityChecklist: this.generateBusinessPlanChecklist(),
          timeline: '2-3 weeks',
          dependencies: ['Market Research', 'Financial Analysis', 'Strategic Planning']
        }
      },
      
      legalCompliance: {
        saudizationPlan: {
          name: 'Saudization Compliance Plan',
          description: 'Comprehensive strategy for meeting Saudi nationalization requirements',
          components: [
            'Current Workforce Analysis',
            'Saudization Gap Assessment',
            'Recruitment Strategy',
            'Training & Development Plan',
            'Retention Strategy',
            'Timeline & Milestones',
            'Budget Requirements',
            'KPIs & Metrics',
            'Risk Mitigation'
          ],
          deliveryFormat: ['PDF Report', 'Excel Tracking Sheets', 'Presentation'],
          qualityChecklist: this.generateSaudizationChecklist(),
          timeline: '3-4 weeks',
          dependencies: ['Workforce Analysis', 'Labor Law Review', 'Strategy Development']
        }
      },
      
      digitalTransformation: {
        digitalStrategy: {
          name: 'Digital Transformation Strategy',
          description: 'Complete digital roadmap for business modernization',
          components: [
            'Current State Assessment',
            'Digital Maturity Analysis',
            'Target Vision & Objectives',
            'Technology Roadmap',
            'Implementation Plan',
            'Change Management Strategy',
            'Budget & ROI Analysis',
            'Risk Assessment',
            'Governance Framework'
          ],
          deliveryFormat: ['PDF Strategy Document', 'Presentation Deck', 'Excel Roadmap'],
          qualityChecklist: this.generateDigitalStrategyChecklist(),
          timeline: '4-6 weeks',
          dependencies: ['Business Analysis', 'Technology Assessment', 'Strategic Planning']
        }
      }
    };
    
    return templates[serviceCategory]?.[deliverableType] || null;
  }

  // Helper methods for Saudi business context
  getSaudiHolidays() {
    return [
      { name: 'Eid al-Fitr', type: 'religious', timing: 'Varies (Ramadan end)' },
      { name: 'Eid al-Adha', type: 'religious', timing: 'Varies (Dhu al-Hijjah)' },
      { name: 'Saudi National Day', type: 'national', timing: 'September 23' },
      { name: 'Founding Day', type: 'national', timing: 'February 22' }
    ];
  }

  generateProjectNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SK-PROJ-${year}-${random}`;
  }

  generateReportNumber() {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `SK-RPT-${year}${month}-${random}`;
  }

  calculateSaudiBusinessDate(daysFromNow) {
    const date = new Date();
    let businessDays = 0;
    
    while (businessDays < Math.abs(daysFromNow)) {
      date.setDate(date.getDate() + (daysFromNow > 0 ? 1 : -1));
      if (date.getDay() !== 5) { // Friday is weekend
        businessDays++;
      }
    }
    
    return date.toISOString().split('T')[0];
  }

  generateSaudiMilestones(duration) {
    const milestones = [];
    const quarter = Math.floor(duration / 4);
    
    milestones.push({
      name: 'Project Kickoff',
      date: this.calculateSaudiBusinessDate(0),
      deliverable: 'Project Initiation Document'
    });
    
    milestones.push({
      name: 'Phase 1 Completion',
      date: this.calculateSaudiBusinessDate(quarter),
      deliverable: 'Phase 1 Deliverables'
    });
    
    milestones.push({
      name: 'Phase 2 Completion',
      date: this.calculateSaudiBusinessDate(quarter * 2),
      deliverable: 'Phase 2 Deliverables'
    });
    
    milestones.push({
      name: 'Project Completion',
      date: this.calculateSaudiBusinessDate(duration),
      deliverable: 'Final Deliverables & Handover'
    });
    
    return milestones;
  }

  generatePaymentSchedule(totalBudget) {
    return [
      { milestone: 'Project Initiation', percentage: 30, amount: totalBudget * 0.3, dueDate: this.calculateSaudiBusinessDate(0) },
      { milestone: 'Phase 1 Completion', percentage: 30, amount: totalBudget * 0.3, dueDate: this.calculateSaudiBusinessDate(30) },
      { milestone: 'Phase 2 Completion', percentage: 30, amount: totalBudget * 0.3, dueDate: this.calculateSaudiBusinessDate(60) },
      { milestone: 'Project Completion', percentage: 10, amount: totalBudget * 0.1, dueDate: this.calculateSaudiBusinessDate(90) }
    ];
  }

  identifySaudiBusinessRisks(serviceCategory) {
    const commonRisks = [
      { risk: 'Government processing delays', probability: 'Medium', impact: 'High', category: 'Regulatory' },
      { risk: 'Changes in Saudi regulations', probability: 'Medium', impact: 'Medium', category: 'Regulatory' },
      { risk: 'Client decision-making delays', probability: 'High', impact: 'Medium', category: 'Client' },
      { risk: 'Talent availability', probability: 'Medium', impact: 'Medium', category: 'Resource' }
    ];
    
    const categorySpecificRisks = {
      businessSetup: [
        { risk: 'Document rejection by authorities', probability: 'Medium', impact: 'High', category: 'Regulatory' },
        { risk: 'License approval delays', probability: 'High', impact: 'High', category: 'Regulatory' }
      ],
      legalCompliance: [
        { risk: 'Non-compliance penalties', probability: 'Low', impact: 'High', category: 'Legal' },
        { risk: 'Saudization target missed', probability: 'Medium', impact: 'High', category: 'Legal' }
      ]
    };
    
    return [...commonRisks, ...(categorySpecificRisks[serviceCategory] || [])];
  }

  // Performance calculation methods
  calculateSchedulePerformance(progressData) {
    const plannedProgress = progressData.plannedProgress || 0;
    const actualProgress = progressData.actualProgress || 0;
    const spi = actualProgress / plannedProgress;
    
    return {
      SPI: spi.toFixed(2),
      status: spi >= 1 ? 'Ahead' : spi >= 0.9 ? 'On Track' : 'Behind',
      variance: ((actualProgress - plannedProgress) / plannedProgress * 100).toFixed(1) + '%'
    };
  }

  calculateBudgetPerformance(progressData) {
    const plannedSpend = progressData.plannedSpend || 0;
    const actualSpend = progressData.actualSpend || 0;
    const cpi = plannedSpend / actualSpend;
    
    return {
      CPI: cpi.toFixed(2),
      status: cpi >= 1 ? 'Under Budget' : cpi >= 0.9 ? 'On Budget' : 'Over Budget',
      variance: (plannedSpend - actualSpend).toFixed(2)
    };
  }

  calculateQualityMetrics(progressData) {
    return {
      deliverableQuality: progressData.qualityScore || 85,
      clientSatisfaction: progressData.satisfactionScore || 90,
      defectRate: progressData.defectRate || 5,
      reworkPercentage: progressData.reworkPercentage || 3
    };
  }

  // Export methods
  exportTemplate(templateType, format = 'json') {
    const template = this.templates[templateType];
    if (!template) return null;
    
    switch (format) {
      case 'json':
        return JSON.stringify(template, null, 2);
      case 'pdf':
        return this.generatePDF(template);
      case 'word':
        return this.generateWordDocument(template);
      default:
        return template;
    }
  }

  generatePDF(template) {
    // In real implementation, would use PDF generation library
    return { type: 'pdf', content: template };
  }

  generateWordDocument(template) {
    // In real implementation, would use Word document generation library
    return { type: 'docx', content: template };
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ServiceDeliveryTemplates;
} else if (typeof window !== 'undefined') {
  window.ServiceDeliveryTemplates = ServiceDeliveryTemplates;
}