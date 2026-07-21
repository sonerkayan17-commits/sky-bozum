import { TargetPayoutCalculator } from '../../components/tools/UtilityCalculators';
import ToolPage from '../../components/tools/ToolPage';
import { createToolMetadata } from '../../lib/tools';

export const metadata = createToolMetadata('hedef-odeme');

export default function Page() {
  return <ToolPage toolId="hedef-odeme"><TargetPayoutCalculator/></ToolPage>;
}
