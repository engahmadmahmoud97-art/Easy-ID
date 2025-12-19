import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import {
  useAllProfiles,
  useLinks,
  useSocialLinks,
  useUpdateProfile,
  useCreateProfile,
  useDeleteProfile,
  useCreateLink,
  useUpdateLink,
  useDeleteLink,
  useCreateSocialLink,
  useUpdateSocialLink,
  useDeleteSocialLink,
  uploadAvatar,
  uploadBackground,
  Link,
  SocialLink,
  Profile,
} from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Save,
  LogOut,
  Upload,
  Eye,
  Link as LinkIcon,
  User,
  Share2,
  ShieldAlert,
  Users,
  ExternalLink,
  Image,
  Palette,
} from "lucide-react";

// URL validation schema
const urlSchema = z.string()
  .min(1, "URL is required")
  .refine(
    (url) => {
      const lowerUrl = url.toLowerCase().trim();
      return !lowerUrl.startsWith("javascript:") && !lowerUrl.startsWith("data:");
    },
    "Invalid link"
  )
  .refine(
    (url) => {
      if (url.startsWith("#")) return true;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    "Invalid link - must start with https://"
  );

const linkSchema = z.object({
  label: z.string().min(1, "Title is required").max(100, "Title is too long"),
  url: urlSchema,
});

const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: urlSchema,
});

const slugSchema = z.string()
  .min(2, "Slug is too short")
  .max(50, "Slug is too long")
  .regex(/^[a-z0-9-]+$/, "Must contain only lowercase English letters, numbers, and hyphens");

const Admin = () => {
  const { isAuthenticated, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const { data: profiles = [], isLoading: profilesLoading } = useAllProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

  const { data: links = [], isLoading: linksLoading } = useLinks(selectedProfile?.id);
  const { data: socialLinks = [], isLoading: socialLoading } = useSocialLinks(selectedProfile?.id);

  const updateProfile = useUpdateProfile();
  const createProfile = useCreateProfile();
  const deleteProfile = useDeleteProfile();
  const createLink = useCreateLink();
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();
  const createSocialLink = useCreateSocialLink();
  const updateSocialLink = useUpdateSocialLink();
  const deleteSocialLink = useDeleteSocialLink();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [slug, setSlug] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [boxTextColor, setBoxTextColor] = useState("#1a1a2e");
  const [iconColor, setIconColor] = useState("#d4a574");
  const [iconBgColor, setIconBgColor] = useState("#1a1a2e");
  const [editableLinks, setEditableLinks] = useState<Link[]>([]);
  const [editableSocials, setEditableSocials] = useState<SocialLink[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);

  // New profile form
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileSlug, setNewProfileSlug] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (profiles.length > 0 && !selectedProfileId) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  useEffect(() => {
    if (selectedProfile) {
      setName(selectedProfile.name);
      setTagline(selectedProfile.tagline || "");
      setSlug(selectedProfile.slug || "");
      setAvatarUrl(selectedProfile.avatar_url || "");
      setBackgroundUrl(selectedProfile.background_url || "");
      setBoxColor(selectedProfile.box_color || "#ffffff");
      setBoxTextColor(selectedProfile.box_text_color || "#1a1a2e");
      setIconColor(selectedProfile.icon_color || "#d4a574");
      setIconBgColor(selectedProfile.icon_bg_color || "#1a1a2e");
    }
  }, [selectedProfile]);

  useEffect(() => {
    setEditableLinks(links);
  }, [links]);

  useEffect(() => {
    setEditableSocials(socialLinks);
  }, [socialLinks]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProfile) return;

    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      setAvatarUrl(url);
      await updateProfile.mutateAsync({ id: selectedProfile.id, avatar_url: url });
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Error uploading image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProfile) return;

    setUploadingBackground(true);
    try {
      const url = await uploadBackground(file);
      setBackgroundUrl(url);
      await updateProfile.mutateAsync({ id: selectedProfile.id, background_url: url });
      toast({ title: "Background uploaded successfully" });
    } catch (error) {
      toast({ title: "Error uploading background", variant: "destructive" });
    } finally {
      setUploadingBackground(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!selectedProfile) return;

    // Validate slug
    const slugValidation = slugSchema.safeParse(slug);
    if (!slugValidation.success) {
      toast({ title: slugValidation.error.errors[0]?.message, variant: "destructive" });
      return;
    }

    try {
      await updateProfile.mutateAsync({
        id: selectedProfile.id,
        name,
        tagline,
        slug,
        avatar_url: avatarUrl,
        box_color: boxColor,
        box_text_color: boxTextColor,
        icon_color: iconColor,
        icon_bg_color: iconBgColor,
      });
      toast({ title: "Profile saved successfully" });
    } catch (error: any) {
      if (error?.message?.includes("duplicate")) {
        toast({ title: "This slug is already in use", variant: "destructive" });
      } else {
        toast({ title: "Error saving profile", variant: "destructive" });
      }
    }
  };

  const handleCreateProfile = async () => {
    const slugValidation = slugSchema.safeParse(newProfileSlug);
    if (!slugValidation.success) {
      toast({ title: slugValidation.error.errors[0]?.message, variant: "destructive" });
      return;
    }

    if (!newProfileName.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    try {
      const newProfile = await createProfile.mutateAsync({
        name: newProfileName,
        slug: newProfileSlug,
      });
      setSelectedProfileId(newProfile.id);
      setShowNewProfile(false);
      setNewProfileName("");
      setNewProfileSlug("");
      toast({ title: "Profile created successfully" });
    } catch (error: any) {
      if (error?.message?.includes("duplicate")) {
        toast({ title: "This slug is already in use", variant: "destructive" });
      } else {
        toast({ title: "Error creating profile", variant: "destructive" });
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfile || profiles.length <= 1) {
      toast({ title: "Cannot delete the only profile", variant: "destructive" });
      return;
    }

    if (!confirm(`Are you sure you want to delete "${selectedProfile.name}"?`)) return;

    try {
      await deleteProfile.mutateAsync(selectedProfile.id);
      setSelectedProfileId(profiles.find(p => p.id !== selectedProfile.id)?.id || null);
      toast({ title: "Profile deleted" });
    } catch (error) {
      toast({ title: "Error deleting profile", variant: "destructive" });
    }
  };

  const handleAddLink = async () => {
    if (!selectedProfile) return;
    try {
      await createLink.mutateAsync({
        profile_id: selectedProfile.id,
        label: "New Link",
        url: "https://",
        icon: "link",
        sort_order: editableLinks.length,
        is_active: true,
      });
      toast({ title: "Link added" });
    } catch (error) {
      toast({ title: "Error adding link", variant: "destructive" });
    }
  };

  const handleUpdateLink = async (link: Link) => {
    const validation = linkSchema.safeParse({ label: link.label, url: link.url });
    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || "Invalid data";
      toast({ title: errorMessage, variant: "destructive" });
      return;
    }

    try {
      await updateLink.mutateAsync(link);
      toast({ title: "Link updated" });
    } catch (error) {
      toast({ title: "Error updating link", variant: "destructive" });
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink.mutateAsync(id);
      toast({ title: "Link deleted" });
    } catch (error) {
      toast({ title: "Error deleting link", variant: "destructive" });
    }
  };

  const handleAddSocial = async () => {
    if (!selectedProfile) return;
    try {
      await createSocialLink.mutateAsync({
        profile_id: selectedProfile.id,
        platform: "instagram",
        url: "https://instagram.com/",
        is_active: true,
        sort_order: editableSocials.length,
      });
      toast({ title: "Social link added" });
    } catch (error) {
      toast({ title: "Error adding social link", variant: "destructive" });
    }
  };

  const handleUpdateSocial = async (social: SocialLink) => {
    const validation = socialLinkSchema.safeParse({ platform: social.platform, url: social.url });
    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || "Invalid data";
      toast({ title: errorMessage, variant: "destructive" });
      return;
    }

    try {
      await updateSocialLink.mutateAsync(social);
      toast({ title: "Social link updated" });
    } catch (error) {
      toast({ title: "Error updating social link", variant: "destructive" });
    }
  };

  const handleDeleteSocial = async (id: string) => {
    try {
      await deleteSocialLink.mutateAsync(id);
      toast({ title: "Social link deleted" });
    } catch (error) {
      toast({ title: "Error deleting social link", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || adminLoading || profilesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="ltr">
        <div className="text-center space-y-4 p-8">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-card-foreground">Unauthorized</h1>
          <p className="text-muted-foreground">You don't have permission to access this page</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card" dir="ltr">
      {/* Header */}
      <header className="bg-primary/10 border-b border-link-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-card-foreground">Admin Dashboard</h1>
          <div className="flex gap-3">
            {selectedProfile?.slug && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/${selectedProfile.slug}`, "_blank")}
                className="border-link-border"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Page
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="border-link-border"
            >
              <Eye className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-destructive font-bold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Selector */}
        <section className="bg-cream/50 rounded-xl p-6 border border-link-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-semibold text-card-foreground">Profiles</h2>
            </div>
            <Button onClick={() => setShowNewProfile(!showNewProfile)} size="sm" className="bg-gold hover:bg-gold/90">
              <Plus className="w-4 h-4 mr-1" />
              New Profile
            </Button>
          </div>

          {/* New Profile Form */}
          {showNewProfile && (
            <div className="bg-background/50 p-4 rounded-lg border border-link-border mb-4 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-card-foreground">Name</Label>
                  <Input
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Profile Name"
                    className="bg-card border-link-border mt-1 text-card-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <Label className="text-card-foreground">URL Slug</Label>
                  <Input
                    value={newProfileSlug}
                    onChange={(e) => setNewProfileSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="my-profile"
                    className="bg-card border-link-border mt-1 text-card-foreground placeholder:text-muted-foreground font-mono text-sm"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateProfile} size="sm" className="bg-gold hover:bg-gold/90">
                  Create
                </Button>
                <Button onClick={() => setShowNewProfile(false)} size="sm" variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Profile List */}
          <div className="flex flex-wrap gap-2">
            {profiles.map((profile) => (
              <Button
                key={profile.id}
                onClick={() => setSelectedProfileId(profile.id)}
                variant={selectedProfileId === profile.id ? "default" : "outline"}
                size="sm"
                className={selectedProfileId === profile.id ? "bg-gold hover:bg-gold/90 text-black font-bold" : "border-link-border"}
              >
                {profile.name}
              </Button>
            ))}
          </div>
        </section>

        {selectedProfile && (
          <>
            {/* Profile Section */}
            <section className="bg-cream/50 rounded-xl p-6 border border-link-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  <h2 className="text-lg font-semibold text-card-foreground">Profile Details</h2>
                </div>
                {profiles.length > 1 && (
                  <Button onClick={handleDeleteProfile} size="sm" variant="ghost" className="text-destructive font-bold">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Profile
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-link border-4 border-gold/30 shadow-2xl">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold hover:bg-gold/90 rounded-full h-10 w-10 shadow-lg"
                    >
                      <Upload className="w-4 h-4 text-black" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {uploading ? "Uploading..." : "Change Avatar"}
                  </p>
                </div>

                {/* Background Upload */}
                <div className="flex flex-col items-center gap-4">
                  <Label className="text-card-foreground flex items-center gap-2 font-bold">
                    <Image className="w-4 h-4 text-gold" />
                    Page Background
                  </Label>
                  <div className="relative w-full max-w-xs">
                    <div className="w-full h-24 rounded-2xl overflow-hidden bg-link border-2 border-gold/30 shadow-inner">
                      {backgroundUrl ? (
                        <img src={backgroundUrl} alt="Background" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-50">
                          <Image className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <input
                      ref={backgroundInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                    />
                    <Button
                      size="icon"
                      onClick={() => backgroundInputRef.current?.click()}
                      disabled={uploadingBackground}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold hover:bg-gold/90 rounded-full h-8 w-8 shadow-lg"
                    >
                      <Upload className="w-3 h-3 text-black" />
                    </Button>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {uploadingBackground ? "Uploading..." : "Click to change background"}
                  </p>
                </div>

                {/* Name, Tagline & Slug */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-card-foreground font-bold">Display Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-card border-link-border mt-1 text-card-foreground h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline" className="text-card-foreground font-bold">Bio / Tagline</Label>
                    <Input
                      id="tagline"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="bg-card border-link-border mt-1 text-card-foreground h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-card-foreground font-bold">Public URL Slug</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-muted-foreground text-sm font-mono">easyid.ly/</span>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        className="bg-card border-link-border text-card-foreground font-mono text-sm h-12 rounded-xl"
                        dir="ltr"
                        placeholder="your-name"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} className="bg-gold hover:bg-gold/90 text-black font-black w-full h-12 rounded-xl shadow-lg shadow-gold/10">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </section>

            {/* Color Customization Section */}
            <section className="bg-cream/50 rounded-xl p-6 border border-link-border">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-semibold text-card-foreground">Color Customization</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Box Colors */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-card-foreground">Link Styling</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-card-foreground text-sm">Background Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={boxColor}
                          onChange={(e) => setBoxColor(e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer border border-link-border bg-transparent"
                        />
                        <Input
                          value={boxColor}
                          onChange={(e) => setBoxColor(e.target.value)}
                          className="bg-card border-link-border flex-1 text-card-foreground font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-card-foreground text-sm">Text Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={boxTextColor}
                          onChange={(e) => setBoxTextColor(e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer border border-link-border bg-transparent"
                        />
                        <Input
                          value={boxTextColor}
                          onChange={(e) => setBoxTextColor(e.target.value)}
                          className="bg-card border-link-border flex-1 text-card-foreground font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Preview */}
                  <div
                    className="p-4 rounded-xl border border-link-border text-center font-bold"
                    style={{ backgroundColor: boxColor, color: boxTextColor }}
                  >
                    Link Preview
                  </div>
                </div>

                {/* Icon Colors */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-card-foreground">Icon Styling</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-card-foreground text-sm">Icon Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer border border-link-border bg-transparent"
                        />
                        <Input
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="bg-card border-link-border flex-1 text-card-foreground font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-card-foreground text-sm">Icon Background</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={iconBgColor}
                          onChange={(e) => setIconBgColor(e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer border border-link-border bg-transparent"
                        />
                        <Input
                          value={iconBgColor}
                          onChange={(e) => setIconBgColor(e.target.value)}
                          className="bg-card border-link-border flex-1 text-card-foreground font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="flex justify-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                      style={{ backgroundColor: iconBgColor, color: iconColor }}
                    >
                      <Share2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="bg-gold hover:bg-gold/90 text-black font-black mt-6 w-full md:w-auto px-10 rounded-xl">
                <Save className="w-4 h-4 mr-2" />
                Save Colors
              </Button>
            </section>

            {/* Links Section */}
            <section className="bg-cream/50 rounded-xl p-6 border border-link-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-gold" />
                  <h2 className="text-lg font-semibold text-card-foreground">Links</h2>
                </div>
                <Button onClick={handleAddLink} size="sm" className="bg-gold hover:bg-gold/90 text-black font-bold">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-4">
                {editableLinks.map((link) => (
                  <div key={link.id} className="flex gap-3 items-center bg-background/50 p-4 rounded-2xl border border-link-border group transition-all hover:border-gold/30">
                    <div className="flex-1 grid md:grid-cols-2 gap-3">
                      <Input
                        value={link.label}
                        onChange={(e) =>
                          setEditableLinks((prev) =>
                            prev.map((l) => (l.id === link.id ? { ...l, label: e.target.value } : l))
                          )
                        }
                        placeholder="Link Title"
                        className="bg-card border-link-border text-card-foreground placeholder:text-muted-foreground h-11 rounded-xl"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) =>
                          setEditableLinks((prev) =>
                            prev.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l))
                          )
                        }
                        placeholder="https://..."
                        className="bg-card border-link-border text-card-foreground placeholder:text-muted-foreground font-mono text-xs h-11 rounded-xl"
                        dir="ltr"
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleUpdateLink(link)}
                      className="text-gold hover:bg-gold/10"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {editableLinks.length === 0 && (
                  <div className="text-center py-10 opacity-50 space-y-2">
                    <LinkIcon className="w-8 h-8 mx-auto" />
                    <p className="text-sm">No links found. Add your first link to get started.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Social Links Section */}
            <section className="bg-cream/50 rounded-xl p-6 border border-link-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-gold" />
                  <h2 className="text-lg font-semibold text-card-foreground">Social Media</h2>
                </div>
                <Button onClick={handleAddSocial} size="sm" className="bg-gold hover:bg-gold/90 text-black font-bold">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Social
                </Button>
              </div>

              <div className="space-y-4">
                {editableSocials.map((social) => (
                  <div key={social.id} className="flex gap-3 items-center bg-background/50 p-4 rounded-2xl border border-link-border transition-all hover:border-gold/30">
                    <div className="flex-1 grid md:grid-cols-2 gap-3">
                      <select
                        value={social.platform}
                        onChange={(e) =>
                          setEditableSocials((prev) =>
                            prev.map((s) => (s.id === social.id ? { ...s, platform: e.target.value } : s))
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-card border border-link-border text-card-foreground h-11 focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                      >
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="tiktok">TikTok</option>
                        <option value="snapchat">Snapchat</option>
                        <option value="youtube">YouTube</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                      <Input
                        value={social.url}
                        onChange={(e) =>
                          setEditableSocials((prev) =>
                            prev.map((s) => (s.id === social.id ? { ...s, url: e.target.value } : s))
                          )
                        }
                        placeholder="Social Profile Link"
                        className="bg-card border-link-border text-card-foreground placeholder:text-muted-foreground font-mono text-xs h-11 rounded-xl"
                        dir="ltr"
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleUpdateSocial(social)}
                      className="text-gold hover:bg-gold/10"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteSocial(social.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {editableSocials.length === 0 && (
                  <div className="text-center py-10 opacity-50 space-y-2">
                    <Share2 className="w-8 h-8 mx-auto" />
                    <p className="text-sm">No social media links yet.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;