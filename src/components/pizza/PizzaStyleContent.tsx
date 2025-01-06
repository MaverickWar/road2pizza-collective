interface PizzaStyleContentProps {
  history: string;
}

export const PizzaStyleContent = ({ history }: PizzaStyleContentProps) => {
  return (
    <div className="bg-secondary rounded-lg p-6 mb-12">
      <h2 className="text-2xl font-bold text-textLight mb-4">History</h2>
      <p className="text-textLight">{history}</p>
    </div>
  );
};