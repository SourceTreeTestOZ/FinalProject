package td.controller;

import java.io.IOException;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import td.service.TDService;

@Controller
public class GeneralController {

	@Autowired
	private TDService service;
	
	@RequestMapping("/")
	public String asd() {
		return "/thymeleaf/HiddenBoard";
	}

	@RequestMapping("/hidden")
	public String goToHidden() {
		return "/thymeleaf/HiddenBoard";
	}
	
	@RequestMapping("/open")
	public String goToOpen() {
		return "/thymeleaf/OpenBoard";
	}
	@RequestMapping("/travel")
	public String goTotravel() {
		return "/thymeleaf/travel.html";
	}
  
	//세션 만드는 로직
	@RequestMapping({"/session"})
    String index(HttpSession session) {
        session.setAttribute("id", "yyy2410");
        session.setAttribute("pw", "123456");
        return "/thymeleaf/session.html";
    }
	
	//세션 삭제 로직
	@RequestMapping({"/session2"})
    String index2(HttpSession session) {
        session.invalidate();
        return "/thymeleaf/session.html";
    }
	
	// 공개 날짜에 맞추어 게시글 데이터 이동 메소드
	@Scheduled(cron = "0 0 0 * * *")
	public void moveToOpen() {
		service.moveToOpen();
	}

//	@Scheduled(initialDelay = 30000, fixedDelay = 10000)
//	public void sendMessage() {
//		service.sendMessage();
//	}

//	@Scheduled(initialDelay = 10000, fixedDelay = 10000)
//	public void sendMessage() {
//		System.out.println("gggg");
//		service.sendMessage();
//	}

	// 미공개 게시판 게시글 작성
//	@PostMapping("/saveHidden")
//	public String saveHiddenBoardDTO(HiddenBoardDTO board) {
//		String url = "";
//		if(service.saveHiddenBoardDTO(board)) {
//			url = "HiddenBoard";
//		}else {
//			url = "Error";
//		}
//		return url;
//	}
	// =====================================

	// 로그인 API
	@RequestMapping("/login")
	public String view(ModelMap model) {
		return "/login";
	}

	@RequestMapping(value = "/kakaoLogin")
	public String login(@RequestParam("code") String code, HttpSession session) {
		return service.kakaoLogin(code, session);
	}

	@RequestMapping(value = "/naverLogin")
	public String naverLogin(@RequestParam("code") String code, @RequestParam String state, HttpSession session)
			throws IOException {
		return service.naverLogin(code, state, session);
	}

	@RequestMapping(value = "/logout")
	public String logout(HttpSession session) {
		return service.logout(session);
	}

//	// 공개 날짜에 맞추어 게시글 데이터 이동 메소드 cron = "0 0 0 * * *"
//	@Scheduled(initialDelay = 2000)
//	public void moveToOpen() {
//		service.moveToOpen();
//	}
}
