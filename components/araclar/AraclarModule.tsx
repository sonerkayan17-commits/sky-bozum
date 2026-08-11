import ToolsSection from './ToolsSection';
import CalculatorShell from './CalculatorShell';
import GuideGrid from './GuideGrid';

export default function AraclarModule({ calculator, guides }: { calculator: React.ReactNode; guides: React.ReactNode }) {
  return (
    <ToolsSection>
      <CalculatorShell>{calculator}</CalculatorShell>
      <div className="content-shell pb-12 sm:pb-16">
        <GuideGrid>{guides}</GuideGrid>
      </div>
    </ToolsSection>
  );
}
