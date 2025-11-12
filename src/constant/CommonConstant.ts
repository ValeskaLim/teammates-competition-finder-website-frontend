// URL
// const BASE = 'http://127.0.0.1:5002';
const BASE = 'https://api.sunibhall.site';
// const BASE_APPROVAL = 'http://127.0.0.1:5000';
const BASE_APPROVAL = 'https://approval.sunibhall.site';
const LOGIN = 'api/user/login';
const SUBMIT_REGISTER = 'api/user/submit-register-data';
const VERIFY_USER_EMAIL = 'api/user/verify-email';
const GET_EXISTING_USER = 'api/user/get-existing-user';
const LOGOUT = 'api/user/logout';
const GET_CURRENT_USER = 'api/user/get-current-user';
const GET_USER_BY_ID = 'api/user/get-user-by-id';
const ADD_COMPETITION = 'api/competition/add';
const GET_EXISTING_COMPETITION = 'api/competition/get-existing-competition';
const GET_ALL_COMPETITION = 'api/competition/get-all-competition';
const EDIT_USER = 'api/user/edit-user';
const CHANGE_PASSWORD = 'api/user/change-password';
const TEAMMATES_LIST = 'api/user/get-all-teammates';
const REMOVE_USER = 'api/user/remove-user-teammates';
const REMOVE_COMPETITION = 'api/competition/remove-competition';
const GET_COMPETITION_BY_ID = 'api/competition/get-competition-by-id';
const EDIT_COMPETITION = 'api/competition/edit-competition';
const ADD_WISHLIST_COMPETITION = 'api/team/add-wishlist-competition';
const REMOVE_WISHLIST_COMPETITION = 'api/team/remove-wishlist-competition';
const RECOMMENDATION = 'api/recommend';
const GET_INVITEES_USER = 'api/user/get-invitees-user';
const REMOVE_USER_INVITATION = 'api/user/remove-user-invitation';
const GET_INVITES_USER = 'api/user/get-invites-user';
const INVITE_USER = 'api/user/invite-user';
const ACCEPT_INVITES = 'api/user/accept-invites';
const REJECT_INVITES = 'api/user/reject-invites';
const CHECK_IS_HAVE_TEAM = 'api/user/check-is-have-team';
const CREATE_TEAM = 'api/team/create-team';
const FINALIZE_TEAM = 'api/team/finalize-team';
const CHECK_IS_LEADER = 'api/team/check-is-leader';
const IMAGE_SOURCE = 'api/competition/uploads/';
const IMAGE_PROOF_SOURCE = 'api/proof-transaction/uploads/';
const CHECK_ANY_COMPETITIONS_JOINED = 'api/team/check-any-competitions-joined';
const RESET_PASSWORD = 'api/user/reset-password';
const VALIDATE_TOKEN = 'api/user/validate-token';
const RESET_PASSWORD_FINAL = 'api/user/reset-password-final';
const CHECK_NUMBER_INVITATIONS = 'api/team/check-number-invitations';
const GET_PARTICIPANTS_BY_COMPETITION_ID = 'api/competition/get-participant-by-id';
const GET_ALL_SKILLSETS = 'api/user/get-list-skillset';
const REQUEST_JOIN_TEAM = 'api/team/request-join-team';
const GET_LIST_TEAM_USER_REQUEST = 'api/team/get-list-team-user-request';
const GET_ALL_PENDING_REQUEST = 'api/team/get-all-pending-request';
const ACCEPT_JOIN_REQUEST = 'api/team/accept-join-request';
const REJECT_JOIN_REQUEST = 'api/team/reject-join-request';
const FILTER_USERS = 'api/find/filter-users-by-skill';
const GET_ALL_USERS = 'api/find/get-all-users';
const EDIT_TEAM = 'api/team/edit-team';
const GET_ALL_CATEGORIES = 'api/competition/get-all-categories';
const GET_ALL_TRANSACTIONS = 'api/proof-transaction/get-all-transactions';
const FINALIZATION_FILE_SOURCE = 'uploads/finalizations';
const GET_PROOF_TRANSACTION = 'api/proof-transaction/get-proof-transaction';

// NAVIGATION CONSTANT
const Login = BASE + '/' + LOGIN;
const SubmitRegister = BASE + '/' + SUBMIT_REGISTER;
const VerifyUserEmail = BASE + '/' + VERIFY_USER_EMAIL;
const GetExistingUser = BASE + '/' + GET_EXISTING_USER;
const Logout = BASE + '/' + LOGOUT;
const GetCurrentUser = BASE + '/' + GET_CURRENT_USER;
const GetUserById = BASE + '/' + GET_USER_BY_ID;
const AddCompetition = BASE + '/' + ADD_COMPETITION;
const GetExistingCompetition = BASE + '/' + GET_EXISTING_COMPETITION;
const GetAllCompetition = BASE + '/' + GET_ALL_COMPETITION;
const EditUser = BASE + '/' + EDIT_USER;
const ChangePassword = BASE + '/' + CHANGE_PASSWORD;
const TeammatesList = BASE + '/' + TEAMMATES_LIST;
const RemoveUser = BASE + '/' + REMOVE_USER;
const RemoveCompetition = BASE + '/' + REMOVE_COMPETITION;
const GetCompetitionById = BASE + '/' + GET_COMPETITION_BY_ID;
const EditCompetition = BASE + '/' + EDIT_COMPETITION;
const AddWishlistCompetition = BASE + '/' + ADD_WISHLIST_COMPETITION;
const RemoveWishlistCompetition = BASE + '/' + REMOVE_WISHLIST_COMPETITION;
const Recommendation = BASE + '/' + RECOMMENDATION;
const InviteUser = BASE + '/' + INVITE_USER;
const GetInviteesUser = BASE + '/' + GET_INVITEES_USER;
const RemoveUserInvitation = BASE + '/' + REMOVE_USER_INVITATION;
const GetInvitesUser = BASE + '/' + GET_INVITES_USER;
const AcceptInvites = BASE + '/' + ACCEPT_INVITES;
const RejectInvites = BASE + '/' + REJECT_INVITES;
const CheckIsHaveTeam = BASE + '/' + CHECK_IS_HAVE_TEAM;
const CreateTeam = BASE + '/' + CREATE_TEAM;
const FinalizeTeam = BASE + '/' + FINALIZE_TEAM;
const CheckIsLeader = BASE + '/' + CHECK_IS_LEADER;
const ImageSource = BASE + '/' + IMAGE_SOURCE;
const CheckAnyCompetitionsJoined = BASE + '/' + CHECK_ANY_COMPETITIONS_JOINED;
const ResetPassword = BASE + '/' + RESET_PASSWORD;
const ValidateToken = BASE + '/' + VALIDATE_TOKEN;
const ResetPasswordFinal = BASE + '/' + RESET_PASSWORD_FINAL;
const CheckNumberInvitations = BASE + '/' + CHECK_NUMBER_INVITATIONS;
const GetParticipantsByCompetitionId = BASE + '/' + GET_PARTICIPANTS_BY_COMPETITION_ID;
const GetAllSkillsets = BASE + '/' + GET_ALL_SKILLSETS;
const RequestJoinTeam = BASE + '/' + REQUEST_JOIN_TEAM;
const GetListTeamUserRequest = BASE + '/' + GET_LIST_TEAM_USER_REQUEST;
const GetAllPendingRequest = BASE + '/' + GET_ALL_PENDING_REQUEST;
const AcceptJoinRequest = BASE + '/' + ACCEPT_JOIN_REQUEST;
const RejectJoinRequest = BASE + '/' + REJECT_JOIN_REQUEST;
const FilterUsers = BASE + '/' + FILTER_USERS;
const GetAllUsers = BASE + '/' + GET_ALL_USERS;
const EditTeam = BASE + '/' + EDIT_TEAM;
const GetAllCategories = BASE + '/' + GET_ALL_CATEGORIES;
const GetAllTransactions = BASE + '/' + GET_ALL_TRANSACTIONS;
const ImageProofSource = BASE + '/' + IMAGE_PROOF_SOURCE;
const FinalizationFileSource = BASE_APPROVAL + '/' + FINALIZATION_FILE_SOURCE;
const GetProofTransaction = BASE + '/' + GET_PROOF_TRANSACTION;

const CommonConstant = {
    Login,
    SubmitRegister,
    VerifyUserEmail,
    GetExistingUser,
    Logout,
    GetCurrentUser,
    AddCompetition,
    GetExistingCompetition,
    GetAllCompetition,
    EditUser,
    TeammatesList,
    RemoveUser,
    RemoveCompetition,
    GetCompetitionById,
    EditCompetition,
    AddWishlistCompetition,
    RemoveWishlistCompetition,
    Recommendation,
    GetInviteesUser,
    RemoveUserInvitation,
    GetInvitesUser,
    AcceptInvites,
    RejectInvites,
    CheckIsHaveTeam,
    CreateTeam,
    GetUserById,
    CheckIsLeader,
    InviteUser,
    ChangePassword,
    ImageSource,
    CheckAnyCompetitionsJoined,
    ResetPassword,
    ValidateToken,
    ResetPasswordFinal,
    CheckNumberInvitations,
    GetParticipantsByCompetitionId,
    FinalizeTeam,
    GetAllSkillsets,
    RequestJoinTeam,
    GetListTeamUserRequest,
    GetAllPendingRequest,
    AcceptJoinRequest,
    RejectJoinRequest,
    FilterUsers,
    GetAllUsers,
    EditTeam,
    GetAllCategories,
    GetAllTransactions,
    ImageProofSource,
    FinalizationFileSource,
    GetProofTransaction
};

export default CommonConstant;
