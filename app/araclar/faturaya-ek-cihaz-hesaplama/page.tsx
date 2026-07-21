import { DeviceCostCalculator } from '../../components/tools/UtilityCalculators';
import ToolPage from '../../components/tools/ToolPage';
import { createToolMetadata } from '../../lib/tools';

export const metadata = createToolMetadata('cihaz-maliyeti');

export default function Page() {
  return <ToolPage toolId="cihaz-maliyeti"><DeviceCostCalculator/></ToolPage>;
}
