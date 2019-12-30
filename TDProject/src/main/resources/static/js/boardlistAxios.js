  
   function heart(heart) {
       heart.classList.toggle('far');
       heart.classList.toggle('fas');
    }

      function updateDate(date) {
         var update = "";
         var year = date.substr(0, 4).concat("년")
         var month = date.substr(4, 2).concat("월")
         var day = date.substr(6, 2).concat("일")
         var update = year + " " + month + " " + day
         return update
      }

      // 전체 게시글 수 받을 변수
      var count

      // 전체 게시글 리스트
      var boardArray

      // vue객체 받아줄 변수 리스트
      var vueInstance = []

      // sorting 종류 받을 변수
      var sortKind

      // 전체 게시글 수 얻어오기
      function getCount() {
         axios.get("http://127.0.0.1:8000/getCount")
            .then(resData => {
               count = resData.data
            }).catch(error => {
               console.log(error)
            })
      }

      function getBoard(pageNum, sorting) {
         scKind = "desc"
         if (sorting == undefined || sorting == "게시날짜") {
            sortKind = "postingDate"
         } else if (sorting == "개봉임박") {
            sortKind = "openDate"
            scKind = "asc"
         } else if (sorting == "좋아요") {
            sortKind = "heart"
         }

         axios.get("http://127.0.0.1:8000/getHidden?page=" + pageNum + "&sort=" + sortKind + "," + scKind)
            .then(resData => {
               getCount()
               boardArray = resData.data.content
               setBoard(count, resData.data.content, pageNum)
            }).catch(error => {
               console.log(error)
            })
      }

      function setBoard(boardCount, boardArray, pageNum) {
         var forNum = boardCount - pageNum * 10 < 10 ? boardCount - pageNum * 10 : 10
         for (let i = 0; i < forNum; i++) {
            board = boardArray[i]
            vueInstance[i].plusHeart = "<i class=\"heart far fa-heart\" onclick=\"heart(this)\" style=\"color:red\"></i>"
            vueInstance[i].plusClaim = "<span class=\"mx-1\" style=\"cursor:pointer;\">신고하기</span><i class=\"fas fa-user-slash\"></i>"
            vueInstance[i].ifflag = false
            vueInstance[i].heartflag = false
            document.getElementById("child" + (i + 1)).innerHTML =
               "<div class=\"text pt-1 mt-1\">"
               + "<span class=\"category mb-1 d-block\"><a href=\"#\">" + board.category + "</a></span>"
               + "<h1 class=\"mb-4 cho-font\"><a style=\"color:black\">Title 싸늘한 바람</a></h1>"
               + "<p class=\"h4 mb-4 cho-font\" style=\"color:darkgray\">" + board.contents + "</p>"
               + "<div class=\"h6 cho-font\">"+ board.hashtag +"</div>"
               + "<div class=\"mb-2 d-flex align-items-center\">"
               + "<div class=\"ch-3 info\">"
               + "<span>작성자</span>"
               + "<h4 class=\"cho-font\">" + board.nickname + ", <span class=\"h5 text-secondary cho-font\">" + updateDate(board.postingDate) + "</span></h4>"
               + "<h4 class=\"cho-font\">감성개봉일, <span class=\"h5 text-secondary cho-font\">" + updateDate(board.openDate) + "</span></h4>"
               + "</div></div></div>"
            /*
			 * "contents : " + boardArray[i].contents + "<br>" + "hashtag : " +
			 * boardArray[i].hashtag + "<br>" + "postingDate : " +
			 * boardArray[i].postingDate + "<br>" + "openDate : " +
			 * boardArray[i].openDate + "<br>" + "claim : " +
			 * boardArray[i].claim + "<br>" + "nickname : " +
			 * boardArray[i].nickname + "<br>" + "category : " +
			 * boardArray[i].category + "<br>" + "좋아요 : "
			 */
            if (board.plusHeartUserId != null) {
             board.plusHeartUserId.includes("유저닉네임") ? vueInstance[i].plusHeart = "<i class=\"heart fas fa-heart\" onclick=\"heart(this)\" style=\"color:red\"></i>" : vueInstance[i].plusHeart = "<i class=\"heart far fa-heart\" onclick=\"heart(this)\" style=\"color:red\"></i>"
            }
            vueInstance[i].boardHeartNum = board.heart
         }
         for (let j = forNum; j < 10; j++) {
            vueInstance[j].ifflag = false
            vueInstance[j].heartflag = false
            vueInstance[j].boardHeartNum = ""
            vueInstance[j].plusHeart = ""
            vueInstance[j].plusClaim = ""
            document.getElementById("child" + (j + 1)).innerHTML = "<span></span>"
         }
      }
      
      function getVue(){
      for (let i = 1; i <= 10; i++) {
         vueInstance[i - 1] = new Vue({
            el: "#row" + i,
            data: {
               tag: "",
               ifflag: false,
               heartflag: false,
               boardHeartNum: 0,
               repHeartNum: 0,
               plusHeart: "<i class=\"heart far fa-heart\" onclick=\"heart(this)\" style=\"color:red\"></i>",
               repPlusHeart: "<i class=\"heart far fa-heart\" onclick=\"heart(this)\" style=\"color:red\"></i>",
               plusClaim: "<span class=\"mx-1\" style=\"cursor:pointer;\">신고하기</span><i class=\"fas fa-user-slash\"></i>"
            },
            methods: {
               comment: function () {
                  axios.get("http://127.0.0.1:8000/getReply?repUserId=" + "유저닉네임" + "&repBoardId=" + boardArray[i - 1].id)
                     .then(resData => {
                        if (resData.data.length == 0) {
                           this.ifflag = true
                           this.heartflag = false
                           this.tag = "<div><textarea id=\"input" + i + "\"class=\"form-control-cho col-4 col-md-8 col-xl-10 rounded\""
                              + "placeholder=\"5자 이상 입력해주세요\" style=\"width: 650px; resize: none;\"></textarea><br>"
                              + "<button type=\"button\" class=\"btn btn-outline-secondary py-3 px-5\" onclick=\"makeReply(" + i + ")\">댓글 남기기</button></div>"
                           /*
							 * "<br><input id='input" + i + "'
							 * placeholder='5자이상 입력해주세요'></input><button
							 * onclick='makeReply(" + i + ")'>댓글 남기기</button>"
							 */
                        } else {
                           this.repHeartNum = resData.data.repHeart
                           this.ifflag = !this.ifflag
                           this.heartflag = !this.heartflag
                           this.tag = "<span class=\"text pt-2 mt-3\">"
                              + "<span class=\"align-items-center\">"
                              + "<span class=\"col-6 p-0\">"
                              + "<h2 class=\"cho-font\">" + resData.data.userId + ", <span class=\"h5 text-secondary cho-font\">" + updateDate(resData.data.repPostingDate) + "</span></h2>"
                              + "<h4 class=\"cho-font text-secondary\">" + resData.data.repContents + "<h4>"
                              + "</span></span></span>"
                              if(resData.data.plusHeartUserId != null){
                                 resData.data.plusHeartUserId.includes("유저닉네임") ? this.repPlusHeart = "<i class=\"heart fas fa-heart\" onclick=\"heart(this)\" style=\"color:red\"></i>" : this.repPlusHeart = "<i class=\"heart far fa-heart\" onclick=\"heart(this)\" style=\"color:red\"></i>"                    
                              }
                           /*
							 * "<br>유저아이디 : " + resData.data[0].userId + "<br>" +
							 * "댓글 내용 : " + resData.data[0].repContents + "<br>" +
							 * "게시 날짜 : " + resData.data[0].repPostingDate + "<br>" +
							 * "좋아요 : "
							 */
                        }
                     }).catch(error => {
                        console.log(error)
                     })
               },
               repHeart: function () {
                  axios.post("http://127.0.0.1:8000/plusHeart?repUserId=" + "유저닉네임" + "&repBoardId=" + boardArray[i - 1].id)
                     .then(resData => {
                        this.repHeartNum = resData.data
                     }).catch(error => {
                        console.log(error)
                     })
               },
               boardHeart: function () {
                  axios.post("http://127.0.0.1:8000/plusBoardHeart?nickname=" + "유저닉네임" + "&id=" + boardArray[i - 1].id)
                     .then(resData => {
                        this.boardHeartNum = resData.data
                     }).catch(error => {
                        console.log(error)
                     })
               },
               makeClaim: function () {
                  axios.post("http://127.0.0.1:8000/plusBoardClaim?nickname=" + "유저닉네임" + "&id=" + boardArray[i - 1].id)
                     .then(resData => {
                        alert(resData.data)
                     }).catch(error => {
                        console.log(error)
                     })
               }
            }
         })
      }
      }

      // innerHTML코드 반복문 함수화
      function setPageNumber(direction, pageNum, loopNum) {
         paging = ""
         for (var i = 1; i <= loopNum; i++) {
            if (i == 1 && direction == 1) {
               paging += " <li class='page-item active'><a class='page-link' id='pageNum" + i + "' onclick='getBoard(" + (pageNum + i - 1) + ",\"sortKind\")' href='javascript:void(0)'>" + (pageNum + i) + "</a></li>"
            } else if (i == loopNum && direction == 2) {
               paging += " <li class='page-item active'><a class='page-link' id='pageNum" + i + "' onclick='getBoard(" + (pageNum + i - 1) + ",\"sortKind\")' href='javascript:void(0)'>" + (pageNum + i) + "</a></li>"
            } else {
               paging += " <li class='page-item'><a class='page-link' id='pageNum" + i + "' onclick='getBoard(" + (pageNum + i - 1) + ",\"sortKind\")' href='javascript:void(0)'>" + (pageNum + i) + "</a></li>"
            }
         }
         return paging
      }

      // 페이징 처리 로직
      function setPaging(direction) {
         // 실시간 전체 게시글 수 동기화
         getCount()

         // innerHTML 받아줄 변수 선언
         var paging = ""

         // 페이징 처리를 위해 기준값 계산
         var standard = parseInt(document.getElementById('pageNum1').innerText / 5)
         var nowNum = Number(document.getElementById('pageNum1').innerText) + 4

         // 끝나는 페이지값 계산
         var endPoint = count % 10 == 0 ? parseInt(count / 10) : parseInt(count / 10) + 1
         parseInt(count / 10) + 1

         // 실제로 들어갈 페이지값
         var nextPage = (standard + 1) * 5
         var prevPage = (standard - 1) * 5

         // 반복되는 구문 초기화
         const next = " <li class='page-item'><a class='page-link' onclick='setPaging(1)' href='javascript:void(0)'>다음</a></li>"
         const prev = "<li class='page-item'><a class='page-link' onclick='setPaging(2)' href='javascript:void(0)'>이전</a></li>"

         // 다음버튼 클릭시
         if (direction == 1) {
            getBoard(nextPage)
            paging = prev
            paging += Number(nowNum) + 5 >= endPoint ? setPageNumber(direction, nextPage, endPoint - (standard + 1) * 5) : setPageNumber(direction, nextPage, 5) + next
            // 이전버튼 클릭시
         } else {
            getBoard(prevPage + 4)
            paging += standard == 1 ? setPageNumber(direction, prevPage, 5) : prev + setPageNumber(direction, prevPage, 5)
            paging += next
         }
         document.getElementById("paging").innerHTML = paging
      }

      function getBoardAndSetPage(pageNum, sorting) {
         getBoard(pageNum, sorting)
         if (count < 50) {
            document.getElementById("paging").innerHTML = setPageNumber(1, 0, parseInt((count - 1) / 10) + 1)
         } else {
            document.getElementById("paging").innerHTML = `<li class="page-item active"><a class="page-link" id="pageNum1" onclick="getBoard(0)" href="javascript:void(0)">1</a></li>
   <li class="page-item"><a class="page-link" id="pageNum2" onclick="getBoard(1)" href="javascript:void(0)">2</a></li>
   <li class="page-item"><a class="page-link" id="pageNum3" onclick="getBoard(2)" href="javascript:void(0)">3</a></li>
   <li class="page-item"><a class="page-link" id="pageNum4" onclick="getBoard(3)" href="javascript:void(0)">4</a></li>
   <li class="page-item"><a class="page-link" id="pageNum5" onclick="getBoard(4)" href="javascript:void(0)">5</a></li>
   <li class="page-item"><a class="page-link" onclick="setPaging(1)" href="javascript:void(0)">다음</a></li>`
         }
      }

      // 페이징 처리 이벤트 추가
      $(document).on("click", "#topheader .pagination a", function () {
         $("#topheader .pagination").find("li.active").removeClass("active");
         $(this).parent("li").addClass("active");
      });

      function makeReply(replyNum) {
         var repContent = document.getElementById("input" + replyNum).value
         axios.post("http://127.0.0.1:8000/saveReply?userId=" + "유저닉네임" + "&repBoardId=" + boardArray[replyNum - 1].id + "&repContents=" + repContent
            + "&repPostingDate=" + "20191218" + "&repHeart=" + 0 + "&repClaim=" + 0)
            .then(resData => {
               if (resData.data == 1) {
                  vueInstance[replyNum - 1].tag = "<span class=\"text pt-2 mt-3\">"
                     + "<span class=\"align-items-center\">"
                     + "<span class=\"col-6 p-0\">"
                     + "<h2 class=\"cho-font\">" + "유저닉네임" + ", <span class=\"h5 text-secondary cho-font\">" + "2019년 12월 27일" + "</span></h2>"
                     + "<h4 class=\"cho-font text-secondary\">" + repContent + "<h4>"
                     + "</span></span></span>"
                  /*
					 * "<br>유저아이디 : " + "유저닉네임" + "<br>" + "댓글 내용 : " +
					 * repContent + "<br>" + "게시 날짜 : " + "20191218" + "<br>" +
					 * "좋아요 : "
					 */
                  vueInstance[replyNum - 1].heartflag = !vueInstance[replyNum - 1].heartflag
                  vueInstance[replyNum - 1].repHeartNum = 0
               } else {
                  alert("저장에 실패했습니다")
               }
            }).catch(error => {
               console.log(error)
            })
      }


      // 페이지 로딩시 바로 실행되는 로직
      function getAxios(){
      axios.get("http://127.0.0.1:8000/getCount")
         .then(resData => {
            // 첫번째 페이지 게시글 가져오고 화면에 뿌려주기
            getBoard(0)
            if (resData.data <= 50) {
               // 전체 게시글수가 50 이하일경우 다음 페이지가 나오면 안되기 때문에 조건식 생성
               document.getElementById("paging").innerHTML = setPageNumber(1, 0, parseInt((resData.data - 1) / 10) + 1)
            }
         }).catch(error => {
            console.log(error)
         })}
      
getVue();
getAxios();
      
      
      
