// router trong trang web client
const ROUTER = {
    auth: {
        login: "/auth/login",
        forgotPassword: "/auth/auth-login/forgot-password"
    },
    information: "/information",
    home: "/",
    master: {
        department: "/admin/department",
        subject: "/admin/subject"
    },
    source_data: {
        students: "/source_data/studentList",
        teachers: "/source_data/teacherList"
    },
    graduation_thesis: {
        list_student_join: "/graduation_thesis/list_student_join",
        thesis: {
            list_thesis: "/graduation_thesis/thesis",
            list_thesis_to_approve: "/graduation_thesis/thesis/approve",
            my_thesis: "/graduation_thesis/thesis/my_thesis",
        },
        thesis_defense_schedule: "/graduation_thesis/thesis_defense_schedule",
        point: "/graduation_thesis/point",

    },
    job: {
        tasks_assignment: "/job/tasks_assignment",
        tasks_assigned: "/job/tasks_assigned",
        tasks_group: "/job/tasks_group"
    }


}
export default ROUTER