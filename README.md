# quickmetrics-action

[![GitHub Actions status](https://github.com/screendriver/quickmetrics-action/workflows/CI/badge.svg)](https://github.com/screendriver/quickmetrics-action/actions)
[![Total alerts](https://img.shields.io/lgtm/alerts/github/screendriver/quickmetrics-action.svg)](https://lgtm.com/projects/g/screendriver/quickmetrics-action/alerts/)
[![codecov](https://codecov.io/gh/screendriver/quickmetrics-action/branch/main/graph/badge.svg)](https://codecov.io/gh/screendriver/quickmetrics-action)

A GitHub action that send metrics to [Quickmetrics](https://quickmetrics.io). This is useful for example when you want to create metrics about how often your GitHub actions run or how often you deploy to production. It could also be used te send an [output](https://help.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#outputs) from a previous action as a metric.

## Usage

See [action.yml](https://github.com/screendriver/quickmetrics-action/blob/main/action.yml)

## Inputs

### `name` (required)

The name of the metric.

### `api-key` (required)

Your personal API key.

### `value`

The value of the metric to send. Must be a number. Default `1`.

### `dimension`

The dimension of the metric to send. Must be a string.

```yaml
steps:
  - name: Quickmetrics
    uses: screendriver/quickmetrics-action@v1
    with:
      name: your-metric-name
      api-key: ${{ secrets.QUICKMETRICS_API_KEY }}
```
