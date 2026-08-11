import AraclarModule from './AraclarModule';

export default function FinalAraclarEntry({
  calculator,
  guides,
}: {
  calculator: React.ReactNode;
  guides: React.ReactNode;
}) {
  return <AraclarModule calculator={calculator} guides={guides} />;
}
