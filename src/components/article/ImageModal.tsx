import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageModalProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, isOpen, onClose }: ImageModalProps) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0" aria-describedby="image-modal-desc">
        <VisuallyHidden asChild>
          <DialogTitle>Full size image view</DialogTitle>
        </VisuallyHidden>
        <div id="image-modal-desc" className="sr-only">
          Click outside or press escape to close the full size image view
        </div>
        <img
          src={imageUrl}
          alt="Full size view"
          className="w-full h-full object-contain"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            console.error('Failed to load full size image:', imageUrl);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;