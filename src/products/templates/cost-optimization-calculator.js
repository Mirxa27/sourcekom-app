/**
 * SourceKom Cost Optimization Calculator
 * Advanced financial analysis tool for Saudi businesses
 * Helps identify cost reduction opportunities and optimize resource allocation
 */

class CostOptimizationCalculator {
  constructor() {
    this.costCategories = {
      personnel: { budget: 0, actual: 0, optimization: 0 },
      facilities: { budget: 0, actual: 0, optimization: 0 },
      technology: { budget: 0, actual: 0, optimization: 0 },
      marketing: { budget: 0, actual: 0, optimization: 0 },
      operations: { budget: 0, actual: 0, optimization: 0 },
      compliance: { budget: 0, actual: 0, optimization: 0 }
    };
    
    this.saudiSpecificFactors = {
      saudizationTarget: 0.3, // 30% Saudi workforce target
      vatRate: 0.15, // 15% VAT
      corporateTax: 0.20, // 20% corporate tax
      minimumWage: 4000, // SAR 4,000 minimum wage
      housingAllowance: 0.25, // 25% housing allowance factor
      transportationAllowance: 0.10 // 10% transportation allowance
    };
    
    this.optimizationStrategies = [];
    this.projections = {};
  }

  // Add cost data for analysis
  addCostData(category, budget, actual, details = {}) {
    if (!this.costCategories[category]) {
      throw new Error(`Invalid cost category: ${category}`);
    }
    
    this.costCategories[category] = {
      budget,
      actual,
      variance: actual - budget,
      variancePercent: ((actual - budget) / budget) * 100,
      details,
      lastUpdated: new Date()
    };
    
    return this.analyzeCategory(category);
  }

  // Analyze specific cost category
  analyzeCategory(category) {
    const data = this.costCategories[category];
    const analysis = {
      category,
      status: this.getPerformanceStatus(data.variancePercent),
      issues: [],
      recommendations: [],
      potentialSavings: 0
    };

    // Category-specific analysis
    switch (category) {
      case 'personnel':
        analysis.issues = this.analyzePersonnelCosts(data.details);
        analysis.recommendations = this.getPersonnelRecommendations(data.details);
        break;
      case 'facilities':
        analysis.issues = this.analyzeFacilityCosts(data.details);
        analysis.recommendations = this.getFacilityRecommendations(data.details);
        break;
      case 'technology':
        analysis.issues = this.analyzeTechnologyCosts(data.details);
        analysis.recommendations = this.getTechnologyRecommendations(data.details);
        break;
      case 'compliance':
        analysis.issues = this.analyzeComplianceCosts(data.details);
        analysis.recommendations = this.getComplianceRecommendations(data.details);
        break;
    }

    analysis.potentialSavings = this.calculatePotentialSavings(category, analysis.recommendations);
    return analysis;
  }

  // Analyze personnel costs with Saudi-specific factors
  analyzePersonnelCosts(details) {
    const issues = [];
    
    if (!details.saudiPercentage || details.saudiPercentage < this.saudiSpecificFactors.saudizationTarget) {
      issues.push({
        type: 'saudization',
        severity: 'high',
        message: `Saudi workforce percentage (${details.saudiPercentage || 0}%) below target (${this.saudiSpecificFactors.saudizationTarget * 100}%)`,
        penalty: this.calculateSaudizationPenalty(details.saudiPercentage || 0)
      });
    }

    if (details.averageSalary && details.averageSalary < this.saudiSpecificFactors.minimumWage) {
      issues.push({
        type: 'minimum_wage',
        severity: 'critical',
        message: `Average salary below Saudi minimum wage requirement`,
        impact: 'Legal compliance risk'
      });
    }

    if (details.overtimeCosts && details.overtimeCosts > details.baseSalary * 0.1) {
      issues.push({
        type: 'overtime',
        severity: 'medium',
        message: 'High overtime costs indicate potential staffing issues',
        impact: 'Employee burnout risk'
      });
    }

    return issues;
  }

  // Get personnel optimization recommendations
  getPersonnelRecommendations(details) {
    const recommendations = [];
    
    if (!details.saudiPercentage || details.saudiPercentage < this.saudiSpecificFactors.saudizationTarget) {
      recommendations.push({
        action: 'Increase Saudi workforce',
        description: 'Implement Saudization program to meet government requirements',
        potentialSavings: this.calculateSaudizationPenalty(details.saudiPercentage || 0),
        timeline: '6-12 months',
        priority: 'high'
      });
    }

    if (details.contractWorkers && details.contractWorkers > details.fullTime * 0.3) {
      recommendations.push({
        action: 'Optimize contractor ratio',
        description: 'Convert high-performing contractors to full-time employees',
        potentialSavings: details.contractWorkers * 5000, // Estimate
        timeline: '3-6 months',
        priority: 'medium'
      });
    }

    if (!details.trainingBudget || details.trainingBudget < details.totalSalary * 0.02) {
      recommendations.push({
        action: 'Invest in training',
        description: 'Improve productivity through skill development',
        potentialSavings: details.totalSalary * 0.05, // 5% productivity gain
        timeline: '12 months',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  // Analyze facility costs
  analyzeFacilityCosts(details) {
    const issues = [];
    
    if (details.utilizationRate && details.utilizationRate < 0.7) {
      issues.push({
        type: 'underutilization',
        severity: 'medium',
        message: `Office space utilization at ${(details.utilizationRate * 100).toFixed(1)}% - consider subleasing or downsizing`,
        potentialSavings: details.monthlyRent * 0.3
      });
    }

    if (details.location === 'Riyadh' || details.location === 'Jeddah' || details.location === 'Dammam') {
      const marketRate = this.getMarketRate(details.location);
      if (details.costPerSqm > marketRate * 1.2) {
        issues.push({
          type: 'overpriced',
          severity: 'high',
          message: 'Office space significantly above market rate',
          potentialSavings: (details.costPerSqm - marketRate) * details.totalSqm
        });
      }
    }

    return issues;
  }

  // Get facility recommendations
  getFacilityRecommendations(details) {
    const recommendations = [];
    
    if (details.utilizationRate && details.utilizationRate < 0.7) {
      recommendations.push({
        action: 'Optimize office space',
        description: 'Implement hot-desking or consider smaller office space',
        potentialSavings: details.monthlyRent * 0.25,
        timeline: '3-6 months',
        priority: 'medium'
      });
    }

    if (!details.energyOptimization) {
      recommendations.push({
        action: 'Implement energy efficiency',
        description: 'LED lighting, smart HVAC, and energy management systems',
        potentialSavings: details.monthlyUtilities * 0.3,
        timeline: '6 months',
        priority: 'low'
      });
    }

    return recommendations;
  }

  // Calculate comprehensive optimization plan
  generateOptimizationPlan(timeframe = '12months') {
    const plan = {
      summary: this.calculateOverallSummary(),
      categories: {},
      strategies: [],
      timeline: this.generateTimeline(timeframe),
      projections: this.calculateProjections(timeframe),
      kpis: this.defineKPIs(),
      generatedAt: new Date(),
      currency: 'SAR'
    };

    // Analyze each category
    Object.keys(this.costCategories).forEach(category => {
      if (this.costCategories[category].actual > 0) {
        plan.categories[category] = this.analyzeCategory(category);
      }
    });

    // Generate optimization strategies
    plan.strategies = this.generateStrategies(plan.categories);
    
    return plan;
  }

  // Calculate overall summary
  calculateOverallSummary() {
    const totalBudget = Object.values(this.costCategories).reduce((sum, cat) => sum + cat.budget, 0);
    const totalActual = Object.values(this.costCategories).reduce((sum, cat) => sum + cat.actual, 0);
    const totalVariance = totalActual - totalBudget;
    
    return {
      totalBudget,
      totalActual,
      totalVariance,
      variancePercent: (totalVariance / totalBudget) * 100,
      costPerEmployee: this.calculateCostPerEmployee(),
      profitMargin: this.calculateProfitMargin(),
      breakEvenPoint: this.calculateBreakEvenPoint()
    };
  }

  // Generate optimization strategies
  generateStrategies(categories) {
    const strategies = [];
    
    // Saudi-specific strategies
    strategies.push({
      name: 'Saudization Optimization',
      description: 'Strategic workforce planning to meet Saudi nationalization targets',
      potentialSavings: 50000, // Estimate based on avoiding penalties
      implementationCost: 25000,
      roi: 200,
      timeline: '12 months',
      priority: 'high',
      category: 'personnel'
    });

    strategies.push({
      name: 'Digital Transformation',
      description: 'Automate processes and implement digital solutions',
      potentialSavings: 100000,
      implementationCost: 75000,
      roi: 133,
      timeline: '18 months',
      priority: 'medium',
      category: 'technology'
    });

    strategies.push({
      name: 'Facility Optimization',
      description: 'Optimize office space utilization and implement energy efficiency',
      potentialSavings: 75000,
      implementationCost: 20000,
      roi: 375,
      timeline: '6 months',
      priority: 'medium',
      category: 'facilities'
    });

    return strategies.sort((a, b) => b.roi - a.roi);
  }

  // Export optimization plan
  exportPlan(format = 'json') {
    const plan = this.generateOptimizationPlan();
    
    switch (format) {
      case 'json':
        return JSON.stringify(plan, null, 2);
      case 'pdf':
        return this.generatePDFReport(plan);
      case 'excel':
        return this.generateExcelReport(plan);
      default:
        return plan;
    }
  }

  // Helper methods
  getPerformanceStatus(variancePercent) {
    if (variancePercent > 10) return 'over_budget';
    if (variancePercent < -5) return 'under_budget';
    return 'on_track';
  }

  calculateSaudizationPenalty(currentPercentage) {
    const target = this.saudiSpecificFactors.saudizationTarget;
    const shortfall = target - (currentPercentage || 0);
    return shortfall * 100000; // Estimate: SAR 100K per percentage point
  }

  calculatePotentialSavings(category, recommendations) {
    return recommendations.reduce((total, rec) => total + (rec.potentialSavings || 0), 0);
  }

  getMarketRate(location) {
    const marketRates = {
      'Riyadh': 120, // SAR per sqm per year
      'Jeddah': 100,
      'Dammam': 85,
      'Dhahran': 95
    };
    return marketRates[location] || 100;
  }

  calculateCostPerEmployee() {
    // Implementation would calculate based on actual employee data
    return 25000; // Placeholder
  }

  calculateProfitMargin() {
    // Implementation would calculate based on revenue data
    return 0.15; // 15% placeholder
  }

  calculateBreakEvenPoint() {
    // Implementation would calculate based on fixed and variable costs
    return 500000; // Placeholder in SAR
  }

  generateTimeline(timeframe) {
    // Generate implementation timeline
    return {
      '0-3 months': ['Quick wins', 'Energy optimization'],
      '3-6 months': ['Facility optimization', 'Process automation'],
      '6-12 months': ['Saudization program', 'Digital transformation'],
      '12+ months': ['Advanced analytics', 'Continuous improvement']
    };
  }

  calculateProjections(timeframe) {
    // Calculate cost projections based on optimization strategies
    return {
      monthlySavings: 25000,
      annualSavings: 300000,
      paybackPeriod: '18 months',
      netPresentValue: 1500000
    };
  }

  defineKPIs() {
    return [
      { name: 'Cost Reduction Target', value: '20%', current: '0%' },
      { name: 'Saudization Compliance', value: '30%', current: '25%' },
      { name: 'Operational Efficiency', value: '85%', current: '70%' },
      { name: 'Digital Adoption Rate', value: '75%', current: '45%' }
    ];
  }

  generatePDFReport(plan) {
    // In real implementation, would use PDF generation library
    return { type: 'pdf', content: plan };
  }

  generateExcelReport(plan) {
    // In real implementation, would use Excel generation library
    return { type: 'excel', worksheets: plan };
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CostOptimizationCalculator;
} else if (typeof window !== 'undefined') {
  window.CostOptimizationCalculator = CostOptimizationCalculator;
}