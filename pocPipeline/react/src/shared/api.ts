/*
 * Copyright 2009-2026 C3 AI (www.c3.ai). All Rights Reserved.
 * Confidential and Proprietary C3 Materials.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

import { CurrentStage, StageVelocity, StatusChange, User, UserGroup } from '../Interfaces';
import { c3Action } from '../c3Action';

export const fetchCurrentStages = async (): Promise<CurrentStage[]> => {
  return c3Action('Poc', 'currentStages', []);
};

export const fetchStageVelocity = async (): Promise<StageVelocity[]> => {
  return c3Action('Poc', 'stageVelocity', []);
};

export const fetchStatusChanges = async (pocId: string): Promise<StatusChange[]> => {
  const response = await c3Action('StatusChange', 'fetch', [
    { filter: `poc.id == "${pocId}"`, order: 'ascending(changedOn)', limit: -1 },
  ]);
  return response.objs;
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await c3Action('User', 'fetch', [{ limit: -1 }]);
  return response.objs;
};

export const fetchUserGroups = async (): Promise<UserGroup[]> => {
  const response = await c3Action('UserGroup', 'fetch', [{ limit: -1 }]);
  return response.objs;
};
