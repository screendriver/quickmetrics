import { assert } from 'chai';
import sinon from 'sinon';
import * as actionsCore from '@actions/core';
import { Got } from 'got';
import { sendToQuickmetrics, logResponse } from '../src/metrics';

function createCore() {
  const getInput = sinon.stub();
  getInput.withArgs('event', { required: true }).returns('my-event');
  getInput.withArgs('key', { required: true }).returns('foobar123');
  return {
    getInput,
    setFailed: sinon.fake(),
    info: sinon.fake(),
  };
}

function createGot() {
  return {
    post: sinon.fake.returns({
      json: sinon.stub().resolves({}),
    }),
  };
}

function createArguments() {
  return {
    core: createCore(),
    got: createGot(),
    apiKey: 'test-key',
    name: 'my-name',
    value: 12,
  };
}

async function doSendToQuickmetrics(dimension?: string) {
  const args = createArguments();
  await sendToQuickmetrics({
    got: (args.got as unknown) as Got,
    core: (args.core as unknown) as typeof actionsCore,
    name: args.name,
    apiKey: args.apiKey,
    value: args.value,
    dimension,
  });
  return args;
}

suite('metrics', function () {
  test('sendToQuickmetrics() use correct Quickmetrics URL', async function () {
    const { got } = await doSendToQuickmetrics();
    sinon.assert.calledWith(got.post, 'https://qckm.io/json');
  });

  test('sendToQuickmetrics() set correct HTTP headers', async function () {
    const { got, apiKey } = await doSendToQuickmetrics();
    const actual = got.post.args[0]![1].headers;
    const expected = {
      'x-qm-key': apiKey,
    };
    assert.deepEqual(actual, expected);
  });

  test('sendToQuickmetrics() sends JSON body without dimension', async function () {
    const { got, value, name } = await doSendToQuickmetrics();
    const actual = got.post.args[0]![1].json;
    const expected = {
      name,
      value,
      dimension: undefined,
    };
    assert.deepEqual(actual, expected);
  });

  test('sendToQuickmetrics() sends JSON body with dimension', async function () {
    const dimension = 'custom-dimension';
    const { got, value, name } = await doSendToQuickmetrics(dimension);
    const actual = got.post.args[0]![1].json;
    const expected = {
      name,
      value,
      dimension,
    };
    assert.deepEqual(actual, expected);
  });

  test('logResponse() logs no info when error occurred', function () {
    const core = createCore();
    const error = {
      error: 'An Error',
    };
    logResponse((core as unknown) as typeof actionsCore)(error);
    sinon.assert.notCalled(core.info);
  });

  test('logResponse() sets failed when error occurred', function () {
    const core = createCore();
    const error = {
      error: 'An Error',
    };
    logResponse((core as unknown) as typeof actionsCore)(error);
    sinon.assert.calledWith(core.setFailed, 'An Error');
  });

  test('logResponse() logs info when no error occurred', function () {
    const core = createCore();
    const error = {};
    logResponse((core as unknown) as typeof actionsCore)(error);
    sinon.assert.calledWith(core.info, 'Metrics sent');
  });

  test('logResponse() sets not failed when no error occurred', function () {
    const core = createCore();
    const error = {};
    logResponse((core as unknown) as typeof actionsCore)(error);
    sinon.assert.notCalled(core.setFailed);
  });
});
