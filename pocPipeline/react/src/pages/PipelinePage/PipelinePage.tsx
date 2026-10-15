import React, { useEffect, useState } from 'react';
import { Grid, GridColumn, GridDetailRowProps } from '@progress/kendo-react-grid';
import {
  Chart,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartSeries,
  ChartSeriesItem,
  ChartValueAxis,
  ChartValueAxisItem,
} from '@progress/kendo-react-charts';
import TopNav from '@/components/TopNav/TopNav';
import { CurrentStage, Stage, StageVelocity, StatusChange } from '@/Interfaces';
import { fetchCurrentStages, fetchStageVelocity, fetchStatusChanges } from '../../shared/api';

const STAGE_LABELS: Record<Stage, string> = {
  IDEA: 'Idea',
  PROTOTYPE: 'Prototype',
  SHOWN: 'Shown to customer',
  ADOPTED: 'Adopted',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function StatusHistory({ dataItem }: GridDetailRowProps) {
  const [changes, setChanges] = useState<StatusChange[]>([]);

  useEffect(() => {
    fetchStatusChanges(dataItem.id).then(setChanges);
  }, [dataItem.id]);

  return (
    <ol className="space-y-1 text-sm">
      {changes.map((change) => (
        <li key={change.id} className="flex gap-4">
          <span className="w-28 shrink-0 text-secondary">{formatDate(change.changedOn)}</span>
          <span className="w-36 shrink-0 font-medium">{STAGE_LABELS[change.stage]}</span>
          <span>{change.note}</span>
        </li>
      ))}
    </ol>
  );
}

export default function PipelinePage() {
  const [currentStages, setCurrentStages] = useState<CurrentStage[]>([]);
  const [velocity, setVelocity] = useState<StageVelocity[]>([]);

  useEffect(() => {
    fetchCurrentStages().then(setCurrentStages);
    fetchStageVelocity().then(setVelocity);
  }, []);

  const rows = currentStages.map((current) => ({
    ...current.poc,
    stage: STAGE_LABELS[current.stage],
    since: new Date(current.since),
    daysInStage: current.daysInStage,
  }));

  return (
    <>
      <TopNav title="POC Pipeline" />
      <div className="p-4">
        <div className="c3-page-content-enter space-y-4">
          <div className="c3-card">
            <h2 className="text-lg font-medium">Average days in each stage</h2>
            <p className="mb-4 text-sm text-secondary">
              Counts only POCs that have moved on from the stage; the number in brackets is how many.
            </p>
            <Chart style={{ height: 300 }}>
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  categories={velocity.map((row) => `${STAGE_LABELS[row.stage]} (${row.pocCount})`)}
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem title={{ text: 'Days' }} />
              </ChartValueAxis>
              <ChartSeries>
                <ChartSeriesItem
                  type="column"
                  data={velocity.map((row) => row.avgDays)}
                  labels={{ visible: true, format: '{0:n1}' }}
                />
              </ChartSeries>
            </Chart>
          </div>
          <div className="c3-card">
            <h2 className="text-lg font-medium">POCs</h2>
            <p className="mb-4 text-sm text-secondary">Expand a row to see how its stage changed over time.</p>
            <Grid
              data={rows}
              dataItemKey="id"
              scrollable="none"
              detail={StatusHistory}
              autoProcessData
              sortable
              defaultSort={[{ field: 'daysInStage', dir: 'desc' }]}
            >
              <GridColumn field="title" title="POC" />
              <GridColumn field="customer" title="Customer" />
              <GridColumn field="owner" title="Owner" />
              <GridColumn field="stage" title="Current stage" />
              <GridColumn field="since" title="In stage since" format="{0:d MMM yyyy}" />
              <GridColumn field="daysInStage" title="Days in stage" format="{0:n0}" />
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
}
