export const getJobName = function (jobType) {
  switch (jobType) {
    case "refresh_keywords":
      return "Refresh Keywords";
    case "refresh_companies":
      return "Refresh Companies";
    case "refresh_orb":
      return "Refresh ORB";
    case "export_companies":
      return "Export Companies";
    case "refresh_news":
      return "Refresh News";
    case "refresh_news":
      return "Refresh News";
    case "contact_finder":
      return "Contact Finder";
    case "linkedin_finder":
      return "LinkedIn Finder";
    case "playlist_from_file":
      return "Playlist From File";
    case "contacts_from_file":
      return "Contacts From File";
    case "playlist_aggs":
      return "Playlist Statistics Refresh";
    case "salesforce_download":
    case "salesforce_download_nodb":
      return "Salesforce Download";
    case "salesforce_upload":
    case "salesforce_upload_nodb":
      return "Salesforce Upload";
    case "playlist_from_search":
      return "Playlist From Search";
    case "signal_from_search":
      return "Signal From Search";
  }
  return jobType;
};