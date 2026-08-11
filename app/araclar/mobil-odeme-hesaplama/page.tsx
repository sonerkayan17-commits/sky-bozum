import { CategoryPayoutCalculator } from '../../components/tools/UtilityCalculators';
import ToolPage from '../../components/tools/ToolPage';
import { createToolMetadata } from '../../lib/tools';

export const metadata = createToolMetadata('mobil-odeme');

export default function Page() {
  return <ToolPage toolId="mobil-odeme"><CategoryPayoutCalculator category="Mobil Ödeme" title="Operatör / yöntem"/></ToolPage>;
}
