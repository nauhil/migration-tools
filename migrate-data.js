/*
 * Copyright (c) 2018 TopCoder, Inc. All rights reserved.
 */

/**
 * Migrate data to dynamodb
 *
 * @author TCSCODER
 * @version 1.0
 */

const mongoModels = require('./mongodb/models');
const dynamoModels = require('./dynamodb/models');
const logger = require('./utils/logger');
const dynamoDBHelper = require('./dynamodb/db-helper');
const helper = require('./utils/helper');

const projectIdMapping = {};

/**
 * Migrate user data
 */
async function migrateUserData() {
  logger.info('*** migrate user data ***');
  const list = await mongoModels.User.find({});
  for(const user of list) {
    const data = user.toObject();
    data.id = helper.generateIdentifier();
    delete data._id;
    delete data.__v;
    await dynamoDBHelper.create(dynamoModels.User, data);
  }
}

/**
 * Migrate user mapping data
 */
async function migrateUserMappingData() {
  logger.info('*** migrate user mapping data ***');
  const list = await mongoModels.UserMapping.find({});
  for(const mapping of list) {
    const data = mapping.toObject();
    data.id = helper.generateIdentifier();
    delete data._id;
    delete data.__v;
    await dynamoDBHelper.create(dynamoModels.UserMapping, data);
  }
}

async function migrateProjectData() {
  logger.info('*** migrate project data ***');
  const list = await mongoModels.Project.find({});
  for(const project of list) {
    const data = project.toObject();
    data.id = helper.generateIdentifier();
    projectIdMapping[data._id.toString()] = data.id;
    delete data._id;
    delete data.__v;
    await dynamoDBHelper.create(dynamoModels.Project, data);
  }
}

/**
 * Migrate issue data
 */
async function migrateIssueData() {
  logger.info('*** migrate issue data ***');
  const list = await mongoModels.Issue.find({});
  for(const issue of list) {
    const data = issue.toObject();
    data.id = helper.generateIdentifier();
    data.projectId = projectIdMapping[data.projectId.toString()];
    delete data._id;
    delete data.__v;
    await dynamoDBHelper.create(dynamoModels.Issue, data);
  }
}

/**
 * Migrate copilot payment data
 */
async function migrateCopilotPaymentData() {
  logger.info('*** migrate copilot payments data ***');
  const list = await mongoModels.CopilotPayment.find({});
  for(const payment of list) {
    const data = payment.toObject();
    data.id = helper.generateIdentifier();
    data.project = projectIdMapping[data.project.toString()];
    delete data._id;
    delete data.__v;
    await dynamoDBHelper.create(dynamoModels.CopilotPayment, data);
  }
}

/**
 * Migrate owner user team data
 */
async function migrateOwnerUserTeamData() {
  logger.info('*** migrate owner user team data ***');
  const list = await mongoModels.OwnerUserTeam.find({});
  for(const team of list) {
    const data = team.toObject();
    data.id = helper.generateIdentifier();
    delete data._id;
    delete data.__v;
    await dynamoDBHelper.create(dynamoModels.OwnerUserTeam, data);
  }
}

/**
 * Migrate owner user group data
 */
async function migrateOwnerUserGroupData() {
  logger.info('*** migrate owner user group data ***');
  const list = await mongoModels.OwnerUserGroup.find({});
  for(const group of list) {
    const data = group.toObject();
    data.id = helper.generateIdentifier();
    delete data._id;
    delete data.__v;
    await dynamoDBHelper.create(dynamoModels.OwnerUserGroup, data);
  }
}

/**
 * Clean dynamoDB database
 */
async function cleanup() {

  const groups = await dynamoDBHelper.scan(dynamoModels.OwnerUserGroup);
  await dynamoDBHelper.removeAll(dynamoModels.OwnerUserGroup, groups);

  const teams = await dynamoDBHelper.scan(dynamoModels.OwnerUserTeam);
  await dynamoDBHelper.removeAll(dynamoModels.OwnerUserTeam, teams);

  const payments = await dynamoDBHelper.scan(dynamoModels.CopilotPayment);
  await dynamoDBHelper.removeAll(dynamoModels.CopilotPayment, payments);

  const issues = await dynamoDBHelper.scan(dynamoModels.Issue);
  await dynamoDBHelper.removeAll(dynamoModels.Issue, issues);

  const projects = await dynamoDBHelper.scan(dynamoModels.Project);
  await dynamoDBHelper.removeAll(dynamoModels.Project, projects);

  const mappings = await dynamoDBHelper.scan(dynamoModels.UserMapping);
  await dynamoDBHelper.removeAll(dynamoModels.UserMapping, mappings);

  const users = await dynamoDBHelper.scan(dynamoModels.User);
  await dynamoDBHelper.removeAll(dynamoModels.User, users);
}

async function start() {
  await cleanup();
  await migrateUserData();
  await migrateUserMappingData();
  await migrateProjectData();
  await migrateIssueData();
  await migrateCopilotPaymentData();
  await migrateOwnerUserTeamData();
  await migrateOwnerUserGroupData();

  logger.info('migrate data finish!');
  process.exit(0);
}

start();
