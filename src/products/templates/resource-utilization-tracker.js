/**
 * SourceKom Resource Utilization Tracker
 * Advanced Excel-like tracking system for resource optimization
 * Perfect for Saudi businesses looking to optimize costs and improve efficiency
 */

class ResourceUtilizationTracker {
  constructor() {
    this.resources = [];
    this.categories = ['Office Space', 'Equipment', 'Personnel', 'Digital Services', 'Transportation'];
    this.metrics = {
      utilization: {},
      costs: {},
      efficiency: {},
      roi: {}
    };
  }

  // Add new resource to track
  addResource(resourceData) {
    const resource = {
      id: this.generateId(),
      name: resourceData.name,
      category: resourceData.category,
      totalCapacity: resourceData.totalCapacity,
      currentUsage: resourceData.currentUsage || 0,
      costPerUnit: resourceData.costPerUnit,
      currency: resourceData.currency || 'SAR',
      acquisitionDate: resourceData.acquisitionDate || new Date(),
      depreciationRate: resourceData.depreciationRate || 0.1,
      maintenanceCost: resourceData.maintenanceCost || 0,
      location: resourceData.location || 'Riyadh',
      department: resourceData.department || 'General',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.resources.push(resource);
    this.calculateMetrics(resource.id);
    return resource;
  }

  // Calculate comprehensive metrics for a resource
  calculateMetrics(resourceId) {
    const resource = this.resources.find(r => r.id === resourceId);
    if (!resource) return;

    const utilizationRate = (resource.currentUsage / resource.totalCapacity) * 100;
    const monthlyCost = resource.costPerUnit * resource.totalCapacity;
    const actualCost = resource.costPerUnit * resource.currentUsage;
    const efficiency = utilizationRate > 70 ? 'High' : utilizationRate > 40 ? 'Medium' : 'Low';
    
    // ROI calculation (simplified)
    const monthlyRevenue = this.estimateMonthlyRevenue(resource);
    const roi = ((monthlyRevenue - actualCost) / actualCost) * 100;

    this.metrics.utilization[resourceId] = utilizationRate;
    this.metrics.costs[resourceId] = {
      total: monthlyCost,
      actual: actualCost,
      savings: monthlyCost - actualCost,
      currency: resource.currency
    };
    this.metrics.efficiency[resourceId] = efficiency;
    this.metrics.roi[resourceId] = roi;

    return {
      utilizationRate,
      monthlyCost,
      actualCost,
      savings: monthlyCost - actualCost,
      efficiency,
      roi,
      monthlyRevenue
    };
  }

  // Estimate monthly revenue based on resource type
  estimateMonthlyRevenue(resource) {
    const revenueMultipliers = {
      'Office Space': 2.5,
      'Equipment': 1.8,
      'Personnel': 3.2,
      'Digital Services': 4.1,
      'Transportation': 1.5
    };

    const baseRevenue = resource.costPerUnit * resource.currentUsage;
    const multiplier = revenueMultipliers[resource.category] || 2.0;
    
    return baseRevenue * multiplier;
  }

  // Generate optimization recommendations
  generateOptimizationReport() {
    const report = {
      summary: {
        totalResources: this.resources.length,
        averageUtilization: this.calculateAverageUtilization(),
        totalMonthlyCost: this.calculateTotalMonthlyCost(),
        potentialSavings: this.calculatePotentialSavings(),
        generatedAt: new Date()
      },
      recommendations: [],
      alerts: []
    };

    this.resources.forEach(resource => {
      const metrics = this.calculateMetrics(resource.id);
      
      // Underutilized resources
      if (metrics.utilizationRate < 40) {
        report.recommendations.push({
          type: 'underutilization',
          resourceId: resource.id,
          resourceName: resource.name,
          currentUtilization: metrics.utilizationRate,
          recommendation: 'Consider sharing, renting, or reallocating this resource',
          potentialSavings: metrics.savings,
          priority: 'high'
        });
      }

      // Overutilized resources
      if (metrics.utilizationRate > 90) {
        report.alerts.push({
          type: 'overutilization',
          resourceId: resource.id,
          resourceName: resource.name,
          currentUtilization: metrics.utilizationRate,
          recommendation: 'Capacity expansion needed - risk of burnout or failure',
          priority: 'critical'
        });
      }

      // Poor ROI
      if (metrics.roi < 20) {
        report.recommendations.push({
          type: 'poor_roi',
          resourceId: resource.id,
          resourceName: resource.name,
          currentROI: metrics.roi,
          recommendation: 'Review pricing strategy or cost structure',
          priority: 'medium'
        });
      }
    });

    return report;
  }

  // Export data to various formats
  exportData(format = 'json') {
    const data = {
      resources: this.resources,
      metrics: this.metrics,
      report: this.generateOptimizationReport(),
      exportDate: new Date(),
      exportedBy: 'SourceKom Resource Tracker'
    };

    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertToCSV(data.resources);
      case 'excel':
        return this.generateExcelData(data);
      default:
        return data;
    }
  }

  // Convert resource data to CSV format
  convertToCSV(resources) {
    const headers = [
      'ID', 'Name', 'Category', 'Total Capacity', 'Current Usage', 
      'Utilization %', 'Cost Per Unit', 'Monthly Cost', 'Efficiency', 'ROI %', 'Location'
    ];
    
    const rows = resources.map(resource => {
      const metrics = this.calculateMetrics(resource.id);
      return [
        resource.id,
        resource.name,
        resource.category,
        resource.totalCapacity,
        resource.currentUsage,
        metrics.utilizationRate.toFixed(2),
        resource.costPerUnit,
        metrics.monthlyCost.toFixed(2),
        metrics.efficiency,
        metrics.roi.toFixed(2),
        resource.location
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  // Helper methods
  generateId() {
    return 'res_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  calculateAverageUtilization() {
    if (this.resources.length === 0) return 0;
    
    const totalUtilization = this.resources.reduce((sum, resource) => {
      const metrics = this.calculateMetrics(resource.id);
      return sum + metrics.utilizationRate;
    }, 0);
    
    return totalUtilization / this.resources.length;
  }

  calculateTotalMonthlyCost() {
    return this.resources.reduce((total, resource) => {
      const metrics = this.calculateMetrics(resource.id);
      return total + metrics.monthlyCost;
    }, 0);
  }

  calculatePotentialSavings() {
    return this.resources.reduce((total, resource) => {
      const metrics = this.calculateMetrics(resource.id);
      if (metrics.utilizationRate < 70) {
        return total + (metrics.savings * 0.3); // 30% of underutilized cost can be saved
      }
      return total;
    }, 0);
  }

  generateExcelData(data) {
    // This would generate Excel-compatible data structure
    // In a real implementation, you'd use a library like xlsx
    return {
      worksheets: {
        'Resources': data.resources,
        'Metrics': this.formatMetricsForExcel(),
        'Summary': [data.report.summary]
      }
    };
  }

  formatMetricsForExcel() {
    return Object.entries(this.metrics.utilization).map(([resourceId, utilization]) => ({
      ResourceID: resourceId,
      UtilizationRate: utilization,
      MonthlyCost: this.metrics.costs[resourceId]?.total || 0,
      Efficiency: this.metrics.efficiency[resourceId],
      ROI: this.metrics.roi[resourceId]
    }));
  }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResourceUtilizationTracker;
} else if (typeof window !== 'undefined') {
  window.ResourceUtilizationTracker = ResourceUtilizationTracker;
}