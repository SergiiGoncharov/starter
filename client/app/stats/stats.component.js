'use strict';

import template from './stats.html';
import './stats.css';
import moment from 'moment';

let StatsComponent = {
  bindings: {
    positions: '<',
    agencies: '<',
    origins: '<'
  },
  templateUrl: template,
  controller: class StatsComponent {
    constructor(StatsService, Auth) {
      'ngInject';
      this.StatsService = StatsService;
      this.Auth = Auth;

      this.monthlyChart = undefined;
      this.statsByAgency = undefined;
      this.statsByOrigin = undefined;
      this.startDateParam = undefined;
      this.endDateParam = undefined;
      this.selectedPositionsIds = [];
    }

    $onInit() {
      this.allowedToUserPositions = this.filterPositionsWithUserRights(this.positions);
      this.updateStats();
    }

    updateStatsWithNewDates(event) {
      this.startDateParam = event.startDate;
      this.endDateParam = event.endDate;
      this.updateStats();
    }

    updateStatsWithNewPositions(event) {
      this.selectedPositionsIds = event.selectedPositionsIds;
      this.updateStats();
    }

    updateStats() {
      const params = {
        startDate: this.startDateParam && moment(this.startDateParam).format('MM-DD-YYYY'),
        endDate: this.endDateParam && moment(this.endDateParam).format('MM-DD-YYYY'),
        positions: this.selectedPositionsIds
      };

      this.updateStatsByMonth(params);
      this.updateStatsByAgency(params);
      this.updateStatsByOrigin(params);

    }

    updateStatsByMonth(params) {
      this.StatsService.getStatsByMonth(params)
        .then(statsByMonth => {
          this.monthlyChart = this.getMonthlyChart(statsByMonth.data);
        })
        .catch((error) => {
          this.errorHandler(error);
        });
    }

    updateStatsByAgency(params) {
      this.StatsService.getStatsByAgency(params)
        .then(statsByAgency => {
          this.statsByAgency = statsByAgency.data;
        })
        .catch((error) => {
          this.errorHandler(error);
        });
    }

    updateStatsByOrigin(params) {
      this.StatsService.getStatsByOrigin(params)
        .then(statsByOrigin => {
          this.statsByOrigin = statsByOrigin.data;
        })
        .catch((error) => {
          this.errorHandler(error);
        });
    }

    getMonthlyChart(statsByMonth) {

      let monthlyChart = {
        labels: [],
        data: []
      };

      for (let point of statsByMonth) {
        monthlyChart.labels.push(point.date.toLocaleString(navigator.language, {
          month: 'short',
          year: '2-digit'
        }));
        monthlyChart.data.push(point.total);
      }

      return monthlyChart;

    }

    errorHandler(error) {
      console.warn(error);
      if (error.status === -1) {
        this.resetStatsData();
      }
    }

    resetStatsData() {
      this.monthlyChart = undefined;
      this.statsByAgency = undefined;
      this.statsByOrigin = undefined;
    }

    filterPositionsWithUserRights(positions) {

      let filtredPositions = [];
      const positionsAccess = this.Auth.getCurrentUser().positionsAccess;

      if (this.Auth.hasRole("admin") || positionsAccess === undefined || positionsAccess.length === 0) {
        filtredPositions = positions;
      } else {
        for (let pos of positionsAccess) {
          if (positions[pos] !== undefined) {
            filtredPositions.push(positions[pos]);
          }
        }
      }

      return filtredPositions;

    }

  }
};

export default StatsComponent

