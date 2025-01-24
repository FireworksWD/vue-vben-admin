/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2024/12/31 14:32
 * @Remark:
 **/
const generateSummary = (tableOptions: any, data: any) => {
  const columnFields = Object.keys(tableOptions.columns).filter(key => tableOptions.columns[key].show !== false);
  // 统计数据
  const summaryData = columnFields.map((field: any) => {
    const totalField = `total_${field}`;  // 获取对应的统计字段名
    // 查找对应的统计字段，如果存在就显示对应的总计，否则显示 '-'
    const totalValue = data[totalField] ?? null;
    // 如果统计字段存在且不为null，返回统计值；否则返回 '-'
    return totalValue != null ? totalValue : '-';
  });
  if (tableOptions?.rowSelection) {
    summaryData.unshift('-')
  }

  return (
    <a-table-summary>
      <a-table-summary-row>
        {summaryData.map((col: any, index: any) => (
          <a-table-summary-cell key={col.key || col.dataIndex}>
            {index === 0 ? (
              <span>Total</span>
            ) : (
              <a-typography-text>{summaryData[index]}</a-typography-text>
            )}
          </a-table-summary-cell>
        ))}
      </a-table-summary-row>
    </a-table-summary>
  );
};

export const summarySlots = (columns: any, data: any) => {
  return generateSummary(columns, data);
};

