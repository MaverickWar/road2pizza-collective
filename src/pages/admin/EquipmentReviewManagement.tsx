import EquipmentReviewManagement from "@/components/admin/reviews/EquipmentReviewManagement";
import ProtectedRoute from "@/components/ProtectedRoute";

const EquipmentReviewManagementPage = () => {
  return (
    <ProtectedRoute requireAdmin>
      <EquipmentReviewManagement />
    </ProtectedRoute>
  );
};

export default EquipmentReviewManagementPage;