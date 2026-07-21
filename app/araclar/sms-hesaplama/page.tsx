import { CategoryPayoutCalculator } from '../../components/tools/UtilityCalculators';
import ToolPage from '../../components/tools/ToolPage';
import { createToolMetadata } from '../../lib/tools';

export const metadata = createToolMetadata('sms');

export default function Page() {
  return <ToolPage toolId="sms"><CategoryPayoutCalculator category="Mobil Ödeme" title="SMS / operatör yöntemi"/></ToolPage>;
}
