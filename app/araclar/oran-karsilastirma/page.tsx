import { RateComparisonCalculator } from '../../components/tools/UtilityCalculators';
import ToolPage from '../../components/tools/ToolPage';
import { createToolMetadata } from '../../lib/tools';

export const metadata = createToolMetadata('oran-karsilastirma');

export default function Page() {
  return <ToolPage toolId="oran-karsilastirma"><RateComparisonCalculator/></ToolPage>;
}
