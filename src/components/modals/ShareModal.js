import React, { useState } from 'react';
import { X, Copy, Mail, Link, Users, Check } from 'lucide-react';

const ShareModal = ({ onClose, selectedList, onShare }) => {
  const [activeTab, setActiveTab] = useState('link'); // link, email, users
  const [emailData, setEmailData] = useState({
    emails: '',
    message: `Hi! I'd like to share my todo list "${selectedList?.title}" with you.`
  });
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [permissions, setPermissions] = useState('view'); // view, edit, admin

  // Generate share link (in real app, this would come from backend)
  React.useEffect(() => {
    if (selectedList) {
      const link = `${window.location.origin}/shared/${selectedList.id}?token=${btoa(selectedList.id + Date.now())}`;
      setShareLink(link);
    }
  }, [selectedList]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleEmailShare = (e) => {
    e.preventDefault();
    if (!emailData.emails.trim()) return;

    const emails = emailData.emails.split(',').map(email => email.trim());
    onShare({
      type: 'email',
      emails,
      message: emailData.message,
      permissions,
      listId: selectedList.id
    });
  };

  const handleLinkShare = () => {
    onShare({
      type: 'link',
      shareLink,
      permissions,
      listId: selectedList.id
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Share "{selectedList?.title}"
          </h3>
          <button onClick={onClose} className="close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('link')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'link'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link className="w-4 h-4 inline mr-2" />
            Share Link
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Send Email
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Manage Access
          </button>
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <label className="form-label">Permission Level</label>
          <select
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            className="form-select"
          >
            <option value="view">View Only - Can see todos but not edit</option>
            <option value="edit">Can Edit - Can add, edit, and complete todos</option>
            <option value="admin">Admin - Full access including sharing</option>
          </select>
        </div>

        {/* Tab Content */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div>
              <label className="form-label">Share Link</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="form-input flex-1"
                />
                <button
                  onClick={handleCopyLink}
                  className={`btn ${linkCopied ? 'btn-success' : 'btn-secondary'} whitespace-nowrap`}
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                Anyone with this link will be able to access your todo list with {permissions} permissions.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={handleLinkShare}
                className="btn btn-primary flex-1"
              >
                Generate Share Link
              </button>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleEmailShare} className="space-y-4">
            <div>
              <label className="form-label">Email Addresses</label>
              <input
                type="text"
                value={emailData.emails}
                onChange={(e) => setEmailData(prev => ({...prev, emails: e.target.value}))}
                placeholder="Enter emails separated by commas"
                className="form-input"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple emails with commas
              </p>
            </div>

            <div>
              <label className="form-label">Message (Optional)</label>
              <textarea
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({...prev, message: e.target.value}))}
                rows="3"
                className="form-input form-textarea"
                placeholder="Add a personal message..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={!emailData.emails.trim()}
              >
                Send Invitations
              </button>
            </div>
          </form>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                User Management
              </h4>
              <p className="text-gray-600 mb-4">
                This feature allows you to manage who has access to your list and their permission levels.
              </p>
              <p className="text-sm text-gray-500">
                In a full implementation, this would show:
                <br />• Current users with access
                <br />• Ability to change their permissions
                <br />• Option to revoke access
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;