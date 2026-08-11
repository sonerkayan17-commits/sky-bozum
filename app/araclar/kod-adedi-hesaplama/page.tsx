import { CodeCountCalculator } from '../../components/tools/UtilityCalculators';
import ToolPage from '../../components/tools/ToolPage';
import { createToolMetadata } from '../../lib/tools';

export const metadata = createToolMetadata('kod-adedi');

export default function Page() {
  return <ToolPage toolId="kod-adedi"><CodeCountCalculator/></ToolPage>;
}
