export enum MetricName {
  UpstreamRqTotal = 'upstream_rq_total', //总请求数
  UpstreamRqSuccess = 'upstream_rq_success', //总成功数
  UpstreamRqTimeout = 'upstream_rq_timeout', //总时延
  UpstreamRqMaxTimeout = 'upstream_rq_max_timeout', //最大时延

  RatelimitRqTotal = 'ratelimit_rq_total', //总请求数（求和）
  RatelimitRqPass = 'ratelimit_rq_pass', //总成功数
  RatelimitRqLimit = 'ratelimit_rq_limit', //总限流数

  CircuitbreakerOpen = 'circuitbreaker_open', //熔断数
  CircuitbreakerHalfopen = 'circuitbreaker_halfopen', //半开数
}

export const MetricNameMap = {
  [MetricName.UpstreamRqTotal]: {
    text: '总请求数',
    unit: '个',
  },
  [MetricName.UpstreamRqSuccess]: {
    text: '成功数',
    unit: '个',
  },
  [MetricName.UpstreamRqMaxTimeout]: {
    text: '最大时延',
    unit: 'ms',
  },
  [MetricName.UpstreamRqTimeout]: {
    text: '平均时延',
    unit: 'ms',
  },
  [MetricName.RatelimitRqTotal]: {
    text: '总请求数',
    unit: '个',
  },
  [MetricName.RatelimitRqPass]: {
    text: '通过数',
    unit: '个',
  },
  [MetricName.RatelimitRqLimit]: {
    text: '限流数',
    unit: '个',
  },
  [MetricName.CircuitbreakerOpen]: {
    text: '熔断数',
    unit: '个',
  },
  [MetricName.CircuitbreakerHalfopen]: {
    text: '半开数',
    unit: '个',
  },
}
export enum MonitorLabelKey {
  Namespace = 'callee_namespace', //被调命名空间

  Service = 'callee_service', //被调服务名

  Method = 'callee_method', //被调接口

  Subset = 'callee_subset', //被调实例分组

  Instance = 'callee_instance', //被调实例（IP:PORT格式）

  RetCode = 'callee_result_code', //返回码

  CalleeLabels = 'callee_labels', //被调请求标签

  CallerLabels = 'caller_labels', //主调请求标签

  CallerNamespace = 'caller_namespace', //主调命名空间

  CallerService = 'caller_service', //主调服务名

  CallerIp = 'caller_ip', //主调IP

  CallerInstance = 'instance', //主调实例
}

export const MetricNameOptions = Object.keys(MetricNameMap).map(key => ({
  text: MetricNameMap[key].text,
  value: key,
}))

export const LabelKeyMap = {
  [MonitorLabelKey.Namespace]: {
    text: '被调命名空间',
    role: 'callee',
  },
  [MonitorLabelKey.Service]: {
    text: '被调服务名',
    role: 'callee',
  },
  [MonitorLabelKey.Method]: {
    text: '被调接口名',
    role: 'callee',
  },
  [MonitorLabelKey.Subset]: {
    text: '被调实例分组',
    role: 'callee',
  },
  [MonitorLabelKey.Instance]: {
    text: '被调实例',
    role: 'callee',
  },
  [MonitorLabelKey.CalleeLabels]: {
    text: '被调请求标签',
    role: 'callee',
  },
  [MonitorLabelKey.RetCode]: {
    text: '返回码',
    role: 'callee',
  },
  [MonitorLabelKey.CallerNamespace]: {
    text: '主调命名空间',
    role: 'caller',
  },
  [MonitorLabelKey.CallerService]: {
    text: '主调服务名',
    role: 'caller',
  },
  [MonitorLabelKey.CallerIp]: {
    text: '主调实例IP',
    role: 'caller',
  },
  [MonitorLabelKey.CallerLabels]: {
    text: '主调请求标签',
    role: 'caller',
  },
  [MonitorLabelKey.CallerInstance]: {
    text: '主调实例',
    role: 'caller',
  },
}

export const LabelKeyOptions = Object.keys(LabelKeyMap).map(key => ({
  text: LabelKeyMap[key].text,
  value: key,
}))

export const OptionSumKey = '__SUM__'
export const OptionAllKey = '__ALL__'
