import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // State
  let ads = Map.empty<Text, Ad>();

  // Blob storage
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type and storage
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles", );
    };
    userProfiles.get(caller);
  };
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles", );
    };
    userProfiles.add(caller, profile);
  };

  // Advertisement data model
  type Ad = {
    id : Text;
    title : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    targetUrl : Text;
    isActive : Bool;
  };

  // Admin-only: Create new advertisement
  public shared ({ caller }) func createAd(id : Text, title : Text, description : Text, image : ?Storage.ExternalBlob, targetUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create advertisements");
    };
    switch (ads.get(id)) {
      case (null) {
        let ad : Ad = {
          id;
          title;
          description;
          image;
          targetUrl;
          isActive = true;
        };
        ads.add(id, ad);
      };
      case (?_) { Runtime.trap("Ad with this id already exists", ) };
    };
  };

  // Public: Get single advertisement (no auth required - guests can view)
  public query ({ caller }) func getAd(id : Text) : async Ad {
    switch (ads.get(id)) {
      case (null) { Runtime.trap("Ad not found", ) };
      case (?ad) { ad };
    };
  };

  // Public: Get all advertisements (no auth required - guests can view)
  public query ({ caller }) func getAllAds() : async [Ad] {
    ads.values().toArray();
  };

  // Admin-only: Deactivate advertisement
  public shared ({ caller }) func deactivateAd(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can deactivate advertisements");
    };
    switch (ads.get(id)) {
      case (null) { Runtime.trap("Ad not found", ) };
      case (?ad) {
        if (not ad.isActive) {
          Runtime.trap("Ad is already inactive", );
        };
        let updatedAd = { ad with isActive = false };
        ads.add(id, updatedAd);
      };
    };
  };
};
