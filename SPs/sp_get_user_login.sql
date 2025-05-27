CREATE PROCEDURE sp_get_user_login
  @Username NVARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    SELECT
      id,
      PasswordHash,
      role
    FROM Users
    WHERE username = @Username;
  END TRY
  BEGIN CATCH
    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
    THROW 50000, @ErrMsg, 1;
  END CATCH
  SET NOCOUNT OFF;
END;