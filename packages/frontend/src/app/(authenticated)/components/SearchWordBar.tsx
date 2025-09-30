"use client";

import { useSearchWordContext } from "@/app/(authenticated)/context/SearchWordProvider";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type searchWordBarProps = {
    mode: "light" | "dark";
};

export default function SearchWordBar({ mode }: searchWordBarProps) {
    // 検索バー

    const { searchWord, setSearchWord } = useSearchWordContext();
    return (
        <form
            onSubmit={(e => {
                e.preventDefault();
            })}>
            <TextField
                id="outlined-search-bar"
                variant="outlined"
                size="medium"
                placeholder="検索"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                sx={{
                    width: {
                        xs: "100%",  // 600px未満 (モバイル) では親要素の幅いっぱい
                        sm: 350,   // 600px以上 (タブレット) では350px
                        md: 500,   // 900px以上 (PC) では500px
                    },
                    backgroundColor: mode === "dark" ? "#2c2c2c" : "#ffffff",
                    borderRadius: "5px"
                }}
                InputProps={{
                    sx: {
                        "&::placeholder": {
                            color: "#9e9e9e", // プレースホルダーの色を設定
                        }
                    },
                }}
            />
        </form>
    );
}