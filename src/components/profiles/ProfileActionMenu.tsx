import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Share2, Trash2 } from "lucide-react";

interface ProfileActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  userRole?: "SuperAdmin" | "Admin" | "Assistant" | "Broker";
}

export function ProfileActionMenu({
  onEdit,
  onDelete,
  onShare,
  userRole = "Broker",
}: ProfileActionMenuProps) {
  // Remove RBAC: show actions purely based on provided handlers

  // Determine which actions are available based solely on provided handlers
  const hasEdit = !!onEdit;
  const hasDelete = !!onDelete;
  const hasShare = !!onShare;

  if (!hasEdit && !hasDelete && !hasShare) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onEdit && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Profile
          </DropdownMenuItem>
        )}
        {onShare && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="cursor-pointer"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}