import { CategoryPayoutCalculator } from '../../components/tools/UtilityCalculators';
import ToolPage from '../../components/tools/ToolPage';
import { createToolMetadata } from '../../lib/tools';

export const metadata = createToolMetadata('gift-card');

export default function Page() {
  return <ToolPage toolId="gift-card"><CategoryPayoutCalculator category="Kod" title="Kart / kod türü"/></ToolPage>;
}
