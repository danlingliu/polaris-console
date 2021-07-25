import BasicLayout from "@src/polaris/common/components/BaseLayout";
import React from "react";
import { DuckCmpProps } from "saga-duck";
import ServicePageDuck from "./PageDuck";
import {
  Button,
  Card,
  Justify,
  Table,
  Segment,
  Form,
  FormText,
  FormItem,
  Text,
  H3,
} from "tea-component";
import GridPageGrid from "@src/polaris/common/duckComponents/GridPageGrid";
import GridPagePagination from "@src/polaris/common/duckComponents/GridPagePagination";
import getColumns from "./getColumns";
import {
  filterable,
  selectable,
  expandable,
} from "tea-component/lib/table/addons";
import insertCSS from "@src/polaris/common/helpers/insertCSS";
import csvColumns from "./csvColumns";
import {
  RULE_TYPE_OPTIONS,
  PolicyMap,
  PolicyName,
  OUTLIER_DETECT_MAP,
  RuleType,
  BREAK_RESOURCE_TYPE_MAP,
  OutlierDetectWhen,
  BREAK_RESOURCE_TYPE,
} from "./types";
import { isReadOnly } from "../../utils";
import { EDIT_TYPE_OPTION, EditType } from "../route/types";

insertCSS(
  "service-detail-instance",
  `
.justify-search{
  margin-right:20px
}
.justify-button{
  vertical-align: bottom
}
`
);

export default function ServiceInstancePage(
  props: DuckCmpProps<ServicePageDuck>
) {
  const { duck, store, dispatch } = props;
  const { creators, selectors, selector } = duck;
  const handlers = React.useMemo(
    () => ({
      reload: () => dispatch(creators.reload()),
      export: () => dispatch(creators.export(csvColumns, "service-list")),
      search: () => dispatch(creators.search("")),
      create: () => dispatch(creators.create()),
      remove: (payload) => dispatch(creators.remove(payload)),
      setExpandedKeys: (payload) => dispatch(creators.setExpandedKeys(payload)),
      setRuleType: (payload) => dispatch(creators.setRuleType(payload)),
    }),
    []
  );
  const {
    expandedKeys,
    grid: { list },
    ruleType,
    data: { namespace },
  } = selector(store);
  const columns = React.useMemo(() => getColumns(props), [ruleType]);

  return (
    <>
      <Table.ActionPanel>
        <Form layout="inline">
          <FormItem label={"编辑格式"}>
            <Segment
              options={EDIT_TYPE_OPTION}
              value={EditType.Table}
            ></Segment>
          </FormItem>
        </Form>
        <Form layout="inline">
          <FormItem label={"规则类型"}>
            <Segment
              options={RULE_TYPE_OPTIONS}
              value={ruleType}
              onChange={handlers.setRuleType}
            ></Segment>
          </FormItem>
        </Form>
        <Justify
          left={
            <>
              <Button
                type={"primary"}
                onClick={handlers.create}
                disabled={isReadOnly(namespace)}
                tooltip={isReadOnly(namespace) && "该命名空间为只读的"}
                style={{ marginTop: "20px" }}
              >
                新建
              </Button>
            </>
          }
          right={
            <Button
              type={"icon"}
              icon={"refresh"}
              onClick={handlers.reload}
            ></Button>
          }
        />
      </Table.ActionPanel>
      <Card>
        <Card.Header>
          <H3 style={{ padding: "10px", color: "black" }}>
            {ruleType === RuleType.Inbound
              ? "当以下服务调用本服务时，遵守下列熔断规则"
              : "当本服务调用以下服务时，遵守下列熔断规则"}
          </H3>
        </Card.Header>
        <GridPageGrid
          duck={duck}
          dispatch={dispatch}
          store={store}
          columns={columns}
          addons={[
            expandable({
              // 已经展开的产品
              expandedKeys,
              // 发生展开行为时，回调更新展开键值
              onExpandedKeysChange: (keys) => handlers.setExpandedKeys(keys),
              render: (record) => {
                return (
                  <>
                    <Form style={{ marginBottom: "15px" }}>
                      <FormItem
                        label={"如果请求标签匹配，按以下策略熔断"}
                      ></FormItem>
                    </Form>
                    <Form
                      key={record.sources
                        .map((source) => source.namespace)
                        .join(",")}
                    >
                      {record.destinations.map((destination, index) => {
                        return (
                          <>
                            <FormItem
                              label="熔断条件"
                              key={`res-policy${index}`}
                            >
                              <FormText>
                                {Object.keys(destination.policy).map(
                                  (key, index) => {
                                    if (key === PolicyName.ErrorRate) {
                                      return (
                                        <Text
                                          parent="p"
                                          key={index}
                                        >{`当请求个数大于${
                                          destination.policy[key]
                                            ?.requestVolumeThreshold || 10
                                        }个，且${PolicyMap[key].text}大于${
                                          destination.policy[key]
                                            .errorRateToOpen
                                        }%时熔断`}</Text>
                                      );
                                    }
                                    if (key === PolicyName.SlowRate) {
                                      return (
                                        <Text
                                          parent="p"
                                          key={index}
                                        >{`以超过${destination.policy[key].maxRt}的请求作为超时请求，${PolicyMap[key].text}大于${destination.policy[key].slowRateToOpen}%时熔断`}</Text>
                                      );
                                    }
                                    if (key === PolicyName.ConsecutiveError) {
                                      return (
                                        <Text
                                          parent="p"
                                          key={index}
                                        >{`当连续请求错误超过${destination.policy[key].consecutiveErrorToOpen}个时熔断`}</Text>
                                      );
                                    }
                                  }
                                )}
                              </FormText>
                            </FormItem>
                            <FormItem
                              label="半开时间"
                              key={`res-recover-time${index}`}
                            >
                              <FormText>
                                {destination.recover?.sleepWindow || "-"}
                              </FormText>
                            </FormItem>
                            <FormItem
                              label="熔断粒度"
                              key={`res-recover-detect${index}`}
                            >
                              {/* 默认值 */}
                              <FormText>
                                {BREAK_RESOURCE_TYPE_MAP[
                                  destination.resource ||
                                    BREAK_RESOURCE_TYPE.SUBSET
                                ]?.text || "-"}
                              </FormText>
                            </FormItem>
                            <FormItem
                              label="主动探测"
                              key={`res-recover-detect${index}`}
                            >
                              {/* 默认值 */}
                              <FormText>
                                {OUTLIER_DETECT_MAP[
                                  destination.recover?.outlierDetectWhen ||
                                    OutlierDetectWhen.NEVER
                                ]?.text || "-"}
                              </FormText>
                            </FormItem>
                          </>
                        );
                      })}
                    </Form>
                  </>
                );
              },
            }),
          ]}
        />
        <GridPagePagination duck={duck} dispatch={dispatch} store={store} />
      </Card>
    </>
  );
}