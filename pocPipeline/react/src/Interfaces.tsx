/*
 * Copyright 2009-2026 C3 AI (www.c3.ai). All Rights Reserved.
 * Confidential and Proprietary C3 Materials.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

export type Stage = 'IDEA' | 'PROTOTYPE' | 'SHOWN' | 'ADOPTED';

export interface Poc {
  id: string;
  title: string;
  customer?: string;
  owner?: string;
}

export interface StatusChange {
  id: string;
  stage: Stage;
  changedOn: string;
  note?: string;
}

export interface StageVelocity {
  stage: Stage;
  pocCount: number;
  avgDays: number;
}

export interface CurrentStage {
  poc: Poc;
  stage: Stage;
  since: string;
  daysInStage: number;
}
