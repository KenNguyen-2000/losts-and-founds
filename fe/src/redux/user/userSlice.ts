import { RootState } from './../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/user';

interface UserState {
  userInfo?: IUser;
  loading: boolean;
  error?: string;
}

const initialState: UserState = {
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUserInfo(state) {
      state.loading = true;
    },
    getUserInfoSuccess(state, action: PayloadAction<IUser>) {
      state.userInfo = action.payload;
      state.loading = false;
    },
    getUserInfoFailed(state, action: PayloadAction<string>) {
      state.loading = false;

      state.error = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export const selectUserInfo = (state: RootState) => state.user.userInfo;

const userReducer = userSlice.reducer;
export default userReducer;
