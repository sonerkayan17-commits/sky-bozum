import { TransactionWizard } from '../../components/tools/UtilityCalculators';
import ToolPage from '../../components/tools/ToolPage';
import { createToolMetadata } from '../../lib/tools';

export const metadata = createToolMetadata('islem-sihirbazi');

export default function Page() {
  return <ToolPage toolId="islem-sihirbazi"><TransactionWizard/></ToolPage>;
}
